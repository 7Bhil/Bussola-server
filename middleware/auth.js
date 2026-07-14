const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Ignorer les requêtes OPTIONS preflight CORS
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentification requise (Token manquant)' });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'SECRET_PAR_DEFAUT_A_CHANGER');
    req.userData = { userId: decodedToken.userId, username: decodedToken.username };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Session invalide ou expirée' });
  }
};
