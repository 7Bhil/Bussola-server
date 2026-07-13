const express = require('express');
const router = express.Router();
const trafficController = require('../controllers/trafficController');
const auth = require('../middleware/auth');

router.post('/track-visit', trafficController.trackVisit);
router.post('/track-pageview', trafficController.trackPageView);
router.post('/track-admin', auth, trafficController.trackAdminVisit);
router.get('/stats', auth, trafficController.getStats);

module.exports = router;
