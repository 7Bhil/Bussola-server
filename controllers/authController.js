const prisma = require('../lib/prisma');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_LOCK_TIME_MS = 30 * 60 * 1000;

exports.register = async (req, res, next) => {
  const { username, password, masterPassword } = req.body;
  
  const masterKey = process.env.ADMIN_MASTER_PASSWORD;
  if (!masterKey) {
    return res.status(500).json({ message: 'Server misconfiguration: ADMIN_MASTER_PASSWORD not set.' });
  }
  if (masterPassword !== masterKey) {
    return res.status(403).json({ message: 'Clé de sécurité Busola invalide. Inscription refusée.' });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) return res.status(400).json({ message: 'Cet utilisateur existe déjà' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { username, password: hashedPassword }
    });
    res.status(201).json({ message: 'Admin créé avec succès' });
  } catch (error) {
    next(error);
  }
};

exports.me = async (req, res, next) => {
  try {
    const { userId } = req.userData || {};
    if (!userId) return res.status(401).json({ message: 'Authentification requise' });
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, role: true, lastLoginAt: true, lastDevice: true, createdAt: true, updatedAt: true }
    });
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json({ _id: user.id, id: user.id, username: user.username, role: user.role, lastLoginAt: user.lastLoginAt, lastDevice: user.lastDevice });
  } catch (error) {
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, username: true, role: true, lastLoginAt: true, lastDevice: true, createdAt: true, updatedAt: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(users.map(u => ({ ...u, _id: u.id })));
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  const normalizedUsername = typeof username === 'string' ? username.trim() : username;

  try {
    const user = await prisma.user.findUnique({ where: { username: normalizedUsername } });
    if (!user) return res.status(401).json({ message: 'Identifiants invalides' });

    const now = Date.now();
    if (user.lockUntil && user.lockUntil.getTime() > now) {
      const retryAfter = Math.ceil((user.lockUntil.getTime() - now) / 1000);
      return res.status(423).json({
        message: 'Compte temporairement verrouillé après trop de tentatives. Réessayez plus tard.',
        retryAfter
      });
    }

    let loginAttempts = user.loginAttempts;
    let lockUntil = user.lockUntil;

    if (lockUntil && lockUntil.getTime() <= now) {
      loginAttempts = 0;
      lockUntil = null;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      loginAttempts = (loginAttempts || 0) + 1;

      if (loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        lockUntil = new Date(now + LOGIN_LOCK_TIME_MS);
        await prisma.user.update({
          where: { id: user.id },
          data: { loginAttempts, lockUntil }
        });

        return res.status(423).json({
          message: 'Compte temporairement verrouillé après trop de tentatives. Réessayez dans 30 minutes.',
          retryAfter: Math.ceil(LOGIN_LOCK_TIME_MS / 1000)
        });
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { loginAttempts, lockUntil }
      });
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const previousLoginAt = user.lastLoginAt;
    const previousDevice = user.lastDevice;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        loginAttempts: 0,
        lockUntil: null,
        lastLoginAt: new Date(),
        lastDevice: req.headers['user-agent'] || 'Appareil inconnu'
      }
    });

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET || 'SECRET_PAR_DEFAUT_A_CHANGER',
      { expiresIn: '24h' }
    );

    res.json({ token, username: user.username, previousLoginAt, previousDevice });

    // Tracker le login
    const today = new Date().toISOString().split('T')[0];
    prisma.traffic.upsert({
      where: { date: today },
      update: { logins: { increment: 1 } },
      create: { date: today, logins: 1 }
    }).catch(() => {});
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userData.userId } });
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    if (newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Mot de passe actuel incorrect' });
      
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
      });
      return res.json({ message: 'Mot de passe mis à jour avec succès' });
    }

    res.status(400).json({ message: 'Aucune donnée à mettre à jour' });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    if (id === req.userData.userId) {
      return res.status(400).json({ message: 'Vous ne pouvez pas supprimer votre propre compte.' });
    }

    const deletedUser = await prisma.user.delete({ where: { id } }).catch(() => null);
    if (!deletedUser) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    
    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    next(error);
  }
};
