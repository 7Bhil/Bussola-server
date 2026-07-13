const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');
const validate = require('../middleware/validator');
const auth = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

const strictLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { message: 'Limite de tentatives atteinte. Réessayez dans une heure.' }
});

router.post('/newsletter', validate('newsletter'), formController.subscribeNewsletter);
router.post('/contact', strictLimiter, validate('contact'), formController.sendContactMessage);

// Admin routes
router.get('/subscribers', auth, formController.getSubscribers);
router.get('/messages', auth, formController.getContactMessages);

module.exports = router;
