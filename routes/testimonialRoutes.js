const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonialController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validator');

router.get('/', testimonialController.getAllTestimonials);
router.get('/admin', auth, testimonialController.getAdminTestimonials);
router.get('/:id', testimonialController.getTestimonialById);
router.post('/', auth, validate('testimonial'), testimonialController.createTestimonial);
router.patch('/:id', auth, validate('testimonial', true), testimonialController.updateTestimonial);
router.delete('/:id', auth, testimonialController.deleteTestimonial);

module.exports = router;
