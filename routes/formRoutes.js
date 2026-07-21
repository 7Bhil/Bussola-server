const express = require('express');
const router = express.Router();
const formController = require('../controllers/formController');
const validate = require('../middleware/validator');
const auth = require('../middleware/auth');
const rateLimit = require('express-rate-limit');
const { blockHoneypot, validateContact } = require('../middleware/contactSecurity');

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Limite de 3 messages par heure atteinte. Réessayez plus tard.' },
  skip: (req) => req.method === 'OPTIONS'
});

router.post('/newsletter', validate('newsletter'), formController.subscribeNewsletter);
router.post('/contact', contactLimiter, blockHoneypot, validateContact, formController.sendContactMessage);

// Admin routes
router.get('/subscribers', auth, formController.getSubscribers);
router.get('/messages', auth, formController.getContactMessages);

module.exports = router;
