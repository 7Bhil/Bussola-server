const { body, matchedData, validationResult } = require('express-validator');

const honeypotFields = ['website', 'url', 'homepage'];

const blockHoneypot = (req, res, next) => {
  const hasHoneypotValue = honeypotFields.some((field) => {
    const value = req.body[field];
    return typeof value === 'string' && value.trim().length > 0;
  });

  if (hasHoneypotValue) {
    return res.status(400).json({ message: 'Requête invalide.' });
  }

  next();
};

const validateContact = [
  body('type')
    .trim()
    .isIn(['partenariat', 'benevolat', 'contact'])
    .withMessage('Le type de message est invalide.'),

  body('name')
    .trim()
    .escape()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le nom doit contenir entre 2 et 50 caractères.'),

  body('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Adresse email invalide.'),

  body('subject')
    .optional({ values: 'falsy' })
    .trim()
    .escape()
    .isLength({ max: 120 })
    .withMessage("L'objet ne doit pas dépasser 120 caractères."),

  body('message')
    .trim()
    .escape()
    .isLength({ min: 10, max: 3000 })
    .withMessage('Le message doit contenir entre 10 et 3000 caractères.'),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Erreur de validation',
        details: errors.array().map((error) => error.msg)
      });
    }

    req.body = matchedData(req, { locations: ['body'] });
    next();
  }
];

module.exports = {
  blockHoneypot,
  validateContact
};
