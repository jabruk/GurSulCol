const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');

/**
 * App Routes 
*/
router.get('/', deviceController.homepage);
router.get('/device/:id', deviceController.exploredevice );
router.get('/categories', deviceController.exploreCategories);
router.get('/categories/:id', deviceController.exploreCategoriesById);
router.post('/search', deviceController.searchdevice);
router.get('/explore-latest', deviceController.exploreLatest);
router.get('/explore-random', deviceController.exploreRandom);
router.get('/submit-device', deviceController.submitdevice);
router.post('/submit-device', deviceController.submitdeviceOnPost);

 
module.exports = router;