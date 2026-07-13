const Testimonial = require('../models/Testimonial');

// Récupérer les témoignages publics non archivés
exports.getAllTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find({ archived: false }).sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    next(error);
  }
};

// Récupérer TOUS les témoignages (Admin)
exports.getAdminTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.json(testimonials);
  } catch (error) {
    next(error);
  }
};

// Récupérer un témoignage par ID
exports.getTestimonialById = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) return res.status(404).json({ message: 'Témoignage non trouvé' });
    res.json(testimonial);
  } catch (error) {
    next(error);
  }
};

// Créer un témoignage
exports.createTestimonial = async (req, res, next) => {
  try {
    const newTestimonial = new Testimonial(req.body);
    await newTestimonial.save();
    res.status(201).json(newTestimonial);
  } catch (error) {
    next(error);
  }
};

// Modifier un témoignage
exports.updateTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!testimonial) return res.status(404).json({ message: 'Témoignage non trouvé' });
    res.json(testimonial);
  } catch (error) {
    next(error);
  }
};

// Supprimer un témoignage
exports.deleteTestimonial = async (req, res, next) => {
  try {
    const deletedTestimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!deletedTestimonial) return res.status(404).json({ message: 'Témoignage non trouvé' });
    res.json({ message: 'Témoignage supprimé avec succès' });
  } catch (error) {
    next(error);
  }
};
