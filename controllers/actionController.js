const prisma = require('../lib/prisma');

const formatAction = (a) => {
  if (!a) return null;
  return {
    ...a,
    _id: a.id,
    project: a.project ? { ...a.project, _id: a.project.id } : a.projectId
  };
};

// Récupérer les actions non archivées (Public)
exports.getAllActions = async (req, res, next) => {
  try {
    const actions = await prisma.action.findMany({
      where: { archived: false },
      include: { project: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(actions.map(formatAction));
  } catch (error) {
    next(error);
  }
};

// Récupérer TOUTES les actions (Admin)
exports.getAdminActions = async (req, res, next) => {
  try {
    const actions = await prisma.action.findMany({
      include: { project: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(actions.map(formatAction));
  } catch (error) {
    next(error);
  }
};

exports.getActionById = async (req, res, next) => {
  try {
    const action = await prisma.action.findUnique({
      where: { id: req.params.id },
      include: { project: true }
    });
    if (!action) return res.status(404).json({ message: 'Action non trouvée' });
    res.json(formatAction(action));
  } catch (error) {
    next(error);
  }
};

exports.createAction = async (req, res, next) => {
  try {
    const { title, description, images, status, location, category, project, projectId, startDate, endDate, beneficiaries, archived } = req.body;
    const targetProjectId = projectId || (typeof project === 'object' ? project._id || project.id : project);

    const action = await prisma.action.create({
      data: {
        title,
        description,
        images: Array.isArray(images) ? images : [],
        status: status || 'En cours',
        location,
        category,
        projectId: targetProjectId,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        beneficiaries: beneficiaries || null,
        archived: Boolean(archived)
      },
      include: { project: true }
    });
    res.status(201).json(formatAction(action));
  } catch (error) {
    next(error);
  }
};

// Modifier une action
exports.updateAction = async (req, res, next) => {
  try {
    const { title, description, images, status, location, category, project, projectId, startDate, endDate, beneficiaries, archived } = req.body;
    const data = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (images !== undefined) data.images = Array.isArray(images) ? images : [];
    if (status !== undefined) data.status = status;
    if (location !== undefined) data.location = location;
    if (category !== undefined) data.category = category;
    
    const targetProjectId = projectId || (typeof project === 'object' ? project._id || project.id : project);
    if (targetProjectId) data.projectId = targetProjectId;

    if (startDate !== undefined) data.startDate = startDate ? new Date(startDate) : null;
    if (endDate !== undefined) data.endDate = endDate ? new Date(endDate) : null;
    if (beneficiaries !== undefined) data.beneficiaries = beneficiaries;
    if (archived !== undefined) data.archived = Boolean(archived);

    const action = await prisma.action.update({
      where: { id: req.params.id },
      data,
      include: { project: true }
    }).catch(() => null);

    if (!action) return res.status(404).json({ message: 'Action non trouvée' });
    res.json(formatAction(action));
  } catch (error) {
    next(error);
  }
};

exports.deleteAction = async (req, res, next) => {
  try {
    const deletedAction = await prisma.action.delete({ where: { id: req.params.id } }).catch(() => null);
    if (!deletedAction) return res.status(404).json({ message: 'Action non trouvée' });
    res.json({ message: 'Action supprimée avec succès' });
  } catch (error) {
    next(error);
  }
};
