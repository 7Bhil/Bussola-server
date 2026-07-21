const User = require('../models/User');
const jwt = require('jsonwebtoken');

const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_LOCK_TIME_MS = 30 * 60 * 1000;

exports.register = async (req, res, next) => {
  const { username, password, masterPassword } = req.body;
  
  // Vérification de la clé de sécurité Busola (stockée dans ADMIN_MASTER_PASSWORD)
  const masterKey = process.env.ADMIN_MASTER_PASSWORD;
  if (!masterKey) {
    return res.status(500).json({ message: 'Server misconfiguration: ADMIN_MASTER_PASSWORD not set.' });
  }
  if (masterPassword !== masterKey) {
    return res.status(403).json({ message: 'Clé de sécurité Busola invalide. Inscription refusée.' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'Cet utilisateur existe déjà' });

    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).json({ message: 'Admin créé avec succès' });
  } catch (error) {
    next(error);
  }
};

exports.me = async (req, res, next) => {
  try {
    // req.userData est injecté par le middleware auth
    const { userId } = req.userData || {};
    if (!userId) return res.status(401).json({ message: 'Authentification requise' });
    const user = await User.findById(userId).select('username role lastLoginAt lastDevice createdAt updatedAt');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json({ id: user._id, username: user.username, role: user.role, lastLoginAt: user.lastLoginAt, lastDevice: user.lastDevice });
  } catch (error) {
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  const normalizedUsername = typeof username === 'string' ? username.trim() : username;

  try {
    const user = await User.findOne({ username: normalizedUsername });
    if (!user) return res.status(401).json({ message: 'Identifiants invalides' });

    const now = Date.now();
    if (user.lockUntil && user.lockUntil.getTime() > now) {
      const retryAfter = Math.ceil((user.lockUntil.getTime() - now) / 1000);
      return res.status(423).json({
        message: 'Compte temporairement verrouillé après trop de tentatives. Réessayez plus tard.',
        retryAfter
      });
    }

    if (user.lockUntil && user.lockUntil.getTime() <= now) {
      user.loginAttempts = 0;
      user.lockUntil = undefined;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      user.loginAttempts = (user.loginAttempts || 0) + 1;

      if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.lockUntil = new Date(now + LOGIN_LOCK_TIME_MS);
        await user.save();

        return res.status(423).json({
          message: 'Compte temporairement verrouillé après trop de tentatives. Réessayez dans 30 minutes.',
          retryAfter: Math.ceil(LOGIN_LOCK_TIME_MS / 1000)
        });
      }

      await user.save();
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const previousLoginAt = user.lastLoginAt;
    const previousDevice = user.lastDevice;

    user.loginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLoginAt = new Date();
    user.lastDevice = req.headers['user-agent'] || 'Appareil inconnu';
    await user.save();

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || 'SECRET_PAR_DEFAUT_A_CHANGER',
      { expiresIn: '24h' }
    );

    res.json({ token, username: user.username, previousLoginAt, previousDevice });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.userData.userId);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    if (newPassword) {
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) return res.status(400).json({ message: 'Mot de passe actuel incorrect' });
      
      user.password = newPassword; // Le hook 'pre-save' s'occupera du hachage
      await user.save();
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
    
    // Empêcher l'auto-suppression accidentelle
    if (id === req.userData.userId) {
      return res.status(400).json({ message: 'Vous ne pouvez pas supprimer votre propre compte.' });
    }

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    
    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    next(error);
  }
};
