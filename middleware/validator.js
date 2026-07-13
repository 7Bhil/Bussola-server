const Joi = require('joi');

const schemas = {
  // Auth
  auth: Joi.object({
    username: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(6).required(),
    masterPassword: Joi.string().allow('', null)
  }),

  // Newsletter
  newsletter: Joi.object({
    email: Joi.string().email().required()
  }),

  // Contact
  contact: Joi.object({
    type: Joi.string().valid('partenariat', 'benevolat', 'contact').required(),
    name: Joi.string().min(2).max(50).required(),
    email: Joi.string().email().required(),
    subject: Joi.string().allow('', null),
    message: Joi.string().min(10).required()
  }),

  // News
  news: Joi.object({
    title: Joi.string().min(5).max(200).required(),
    content: Joi.string().required(),
    summary: Joi.string().allow('', null),
    image: Joi.string().allow('', null),
    category: Joi.string().valid('Action', 'Événement', 'Partenariat', 'Information'),
    author: Joi.string().allow('', null),
    published: Joi.boolean(),
    archived: Joi.boolean()
  }),

  // Action
  action: Joi.object({
    title: Joi.string().min(3).max(200).required(), // Réduit le min à 3 pour être plus souple
    description: Joi.string().required(),
    images: Joi.array().items(Joi.string()).allow(null),
    status: Joi.string().valid('En attente', 'En cours', 'Terminé').default('En cours'),
    location: Joi.string().required(),
    category: Joi.string().valid('Santé', 'Éducation', 'Droit', 'Social', 'Environnement').required(),
    project: Joi.string().hex().length(24).required(),
    startDate: Joi.any(), // Plus flexible sur le format reçu
    endDate: Joi.any(),
    beneficiaries: Joi.string().allow('', null),
    archived: Joi.boolean().default(false)
  }),

  // Testimonial
  testimonial: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    role: Joi.string().min(2).max(100).required(),
    message: Joi.string().min(10).required(),
    image: Joi.string().allow('', null),
    location: Joi.string().allow('', null),
    rating: Joi.number().min(1).max(5).default(5),
    showOnHome: Joi.boolean().default(true),
    showOnActions: Joi.boolean().default(false),
    archived: Joi.boolean().default(false)
  }),

  // Project (Pilier)
  project: Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().required(),
    coverImage: Joi.string().allow('', null),
    color: Joi.string().allow('', null),
    order: Joi.number().integer().min(0).default(0),
    archived: Joi.boolean().default(false)
  })
};

const validate = (schemaName, isUpdate = false) => {
  return (req, res, next) => {
    let schema = schemas[schemaName];
    
    // Si c'est une mise à jour (PATCH), on rend tous les champs optionnels
    if (isUpdate) {
      schema = schema.fork(Object.keys(schema.describe().keys), (s) => s.optional());
    }

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        message: 'Erreur de validation', 
        details: error.details[0].message 
      });
    }
    next();
  };
};

module.exports = validate;
