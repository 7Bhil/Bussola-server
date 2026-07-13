const express = require('express');
const router = express.Router();
const actionController = require('../controllers/actionController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validator');

router.get('/', actionController.getAllActions);
router.get('/admin', auth, actionController.getAdminActions); // Route admin pour voir même les archivés
router.get('/:id', actionController.getActionById);
router.post('/', auth, validate('action'), actionController.createAction);
router.patch('/:id', auth, validate('action', true), actionController.updateAction); // Ajout de la validation pour le patch
router.delete('/:id', auth, actionController.deleteAction);

module.exports = router;
