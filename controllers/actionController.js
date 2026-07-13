const Action = require('../models/Action');

// Récupérer les actions non archivées (Public)
exports.getAllActions = async (req, res, next) => {
  try {
    const actions = await Action.find({ archived: false }).sort({ createdAt: -1 });
    res.json(actions);
  } catch (error) {
    next(error);
  }
};

// Récupérer TOUTES les actions (Admin)
exports.getAdminActions = async (req, res, next) => {
  try {
    const actions = await Action.find().sort({ createdAt: -1 });
    res.json(actions);
  } catch (error) {
    next(error);
  }
};

exports.getActionById = async (req, res, next) => {
  try {
    const action = await Action.findById(req.params.id);
    if (!action) return res.status(404).json({ message: 'Action non trouvée' });
    res.json(action);
  } catch (error) {
    next(error);
  }
};

exports.createAction = async (req, res, next) => {
  try {
    const newAction = new Action(req.body);
    await newAction.save();
    res.status(201).json(newAction);
  } catch (error) {
    next(error);
  }
};

// Modifier une action
exports.updateAction = async (req, res, next) => {
  try {
    const action = await Action.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!action) return res.status(404).json({ message: 'Action non trouvée' });
    res.json(action);
  } catch (error) {
    next(error);
  }
};

exports.deleteAction = async (req, res, next) => {
  try {
    const deletedAction = await Action.findByIdAndDelete(req.params.id);
    if (!deletedAction) return res.status(404).json({ message: 'Action non trouvée' });
    res.json({ message: 'Action supprimée avec succès' });
  } catch (error) {
    next(error);
  }
};
