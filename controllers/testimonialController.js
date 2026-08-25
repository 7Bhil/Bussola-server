const prisma = require('../lib/prisma');

const formatTestimonial = (t) => t ? { ...t, _id: t.id } : null;

// Récupérer les témoignages publics non archivés
exports.getAllTestimonials = async (req, res, next) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { archived: false },
      orderBy: { createdAt: 'desc' }
    });
    res.json(testimonials.map(formatTestimonial));
  } catch (error) {
    next(error);
  }
};

// Récupérer TOUS les témoignages (Admin)
exports.getAdminTestimonials = async (req, res, next) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(testimonials.map(formatTestimonial));
  } catch (error) {
    next(error);
  }
};

// Récupérer un témoignage par ID
exports.getTestimonialById = async (req, res, next) => {
  try {
    const testimonial = await prisma.testimonial.findUnique({ where: { id: req.params.id } });
    if (!testimonial) return res.status(404).json({ message: 'Témoignage non trouvé' });
    res.json(formatTestimonial(testimonial));
  } catch (error) {
    next(error);
  }
};

// Créer un témoignage
exports.createTestimonial = async (req, res, next) => {
  try {
    const { name, role, message, image, location, rating, showOnHome, showOnActions, archived } = req.body;
    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        role,
        message,
        image: image || null,
        location: location || null,
        rating: rating !== undefined ? Number(rating) : 5,
        showOnHome: showOnHome !== undefined ? Boolean(showOnHome) : true,
        showOnActions: showOnActions !== undefined ? Boolean(showOnActions) : false,
        archived: archived !== undefined ? Boolean(archived) : false
      }
    });
    res.status(201).json(formatTestimonial(testimonial));
  } catch (error) {
    next(error);
  }
};

// Modifier un témoignage
exports.updateTestimonial = async (req, res, next) => {
  try {
    const { name, role, message, image, location, rating, showOnHome, showOnActions, archived } = req.body;
    const data = {};
    if (name !== undefined) data.name = name;
    if (role !== undefined) data.role = role;
    if (message !== undefined) data.message = message;
    if (image !== undefined) data.image = image;
    if (location !== undefined) data.location = location;
    if (rating !== undefined) data.rating = Number(rating);
    if (showOnHome !== undefined) data.showOnHome = Boolean(showOnHome);
    if (showOnActions !== undefined) data.showOnActions = Boolean(showOnActions);
    if (archived !== undefined) data.archived = Boolean(archived);

    const testimonial = await prisma.testimonial.update({
      where: { id: req.params.id },
      data
    }).catch(() => null);

    if (!testimonial) return res.status(404).json({ message: 'Témoignage non trouvé' });
    res.json(formatTestimonial(testimonial));
  } catch (error) {
    next(error);
  }
};

// Supprimer un témoignage
exports.deleteTestimonial = async (req, res, next) => {
  try {
    const deletedTestimonial = await prisma.testimonial.delete({ where: { id: req.params.id } }).catch(() => null);
    if (!deletedTestimonial) return res.status(404).json({ message: 'Témoignage non trouvé' });
    res.json({ message: 'Témoignage supprimé avec succès' });
  } catch (error) {
    next(error);
  }
};
