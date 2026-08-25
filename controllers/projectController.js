const prisma = require('../lib/prisma');

const formatProject = (p) => p ? { ...p, _id: p.id } : null;

exports.getAllProjects = async (req, res, next) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }]
    });
    res.json(projects.map(formatProject));
  } catch (error) {
    next(error);
  }
};

exports.getProjectById = async (req, res, next) => {
  try {
    const project = await prisma.project.findUnique({ where: { id: req.params.id } });
    if (!project) return res.status(404).json({ message: 'Projet non trouvé' });
    res.json(formatProject(project));
  } catch (error) {
    next(error);
  }
};

exports.createProject = async (req, res, next) => {
  try {
    const { title, description, coverImage, color, order, pillar } = req.body;
    const project = await prisma.project.create({
      data: {
        title,
        description,
        coverImage,
        color: color || '#3498db',
        order: order !== undefined ? Number(order) : 0,
        pillar: pillar || null
      }
    });
    res.status(201).json(formatProject(project));
  } catch (error) {
    next(error);
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    const { title, description, coverImage, color, order, pillar } = req.body;
    const data = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (coverImage !== undefined) data.coverImage = coverImage;
    if (color !== undefined) data.color = color;
    if (order !== undefined) data.order = Number(order);
    if (pillar !== undefined) data.pillar = pillar;

    const project = await prisma.project.update({
      where: { id: req.params.id },
      data
    }).catch(() => null);

    if (!project) return res.status(404).json({ message: 'Projet non trouvé' });
    res.json(formatProject(project));
  } catch (error) {
    next(error);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const deletedProject = await prisma.project.delete({ where: { id: req.params.id } }).catch(() => null);
    if (!deletedProject) return res.status(404).json({ message: 'Projet non trouvé' });
    res.json({ message: 'Projet supprimé avec succès' });
  } catch (error) {
    next(error);
  }
};
