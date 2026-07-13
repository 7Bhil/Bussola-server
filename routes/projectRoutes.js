const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validator');

router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProjectById);
router.post('/', auth, validate('project'), projectController.createProject);
router.patch('/:id', auth, validate('project', true), projectController.updateProject);
router.delete('/:id', auth, projectController.deleteProject);

module.exports = router;
