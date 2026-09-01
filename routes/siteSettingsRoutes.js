const express = require('express');
const router = express.Router();
const siteSettingsController = require('../controllers/siteSettingsController');
const auth = require('../middleware/auth');

// Public route to fetch settings
router.get('/settings', siteSettingsController.getSettings);

// Protected admin route to update settings
router.put('/settings', auth, siteSettingsController.updateSettings);

module.exports = router;
