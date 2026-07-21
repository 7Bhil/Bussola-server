const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middleware/validator');
const rateLimit = require('express-rate-limit');

// Rate limiter spécifique pour le login (protection brute force)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives
  message: { message: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.' },
  skip: (req) => req.method === 'OPTIONS',
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false
});

// Rate limiter pour les autres routes sensibles
const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { message: 'Limite de tentatives atteinte. Réessayez dans une heure.' },
  skip: (req) => req.method === 'OPTIONS'
});

const auth = require('../middleware/auth');

router.post('/register', strictLimiter, validate('auth'), authController.register);
router.post('/login', loginLimiter, validate('auth'), authController.login);
router.get('/me', auth, authController.me);
router.put('/update', auth, authController.updateProfile);
router.delete('/:id', auth, authController.deleteUser);
router.get('/', auth, authController.getUsers);

module.exports = router;
