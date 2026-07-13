const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validator');

router.get('/', newsController.getAllNews);
router.get('/admin', auth, newsController.getAdminNews); // Route admin pour voir même les archivés
router.get('/:id', newsController.getNewsById);
router.post('/', auth, validate('news'), newsController.createNews);
router.patch('/:id', auth, validate('news', true), newsController.updateNews); // Ajout de la validation pour le patch
router.delete('/:id', auth, newsController.deleteNews);

module.exports = router;
