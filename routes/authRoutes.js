const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middleware/validator');
const rateLimit = require('express-rate-limit');

const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { message: 'Limite de tentatives atteinte. Réessayez dans une heure.' },
  skip: (req) => req.method === 'OPTIONS'
});

const auth = require('../middleware/auth');

router.post('/register', strictLimiter, validate('auth'), authController.register);
router.post('/login', strictLimiter, validate('auth'), authController.login);
router.get('/me', auth, authController.me);
router.put('/update', auth, authController.updateProfile);
router.delete('/:id', auth, authController.deleteUser);
router.get('/', auth, authController.getUsers);

module.exports = router;
