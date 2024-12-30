const express = require('express');
const router = express.Router();
const adController = require('../controllers/adController');
const uploadAssetMiddleware = require('../../../core/middlewares/uploadAsset');

// Routes for running ads controller are here
/**
 * Uploads a single ad asset to the server.
 * The asset is expected to be sent in the request body as a form field named 'image'.
 * The asset is then stored in the assets folder.
 * A JSON response is sent back with the asset path if the upload is successful.
 * Otherwise, a 400 error is sent back with an error message.
 */
router.post('/upload-ad', uploadAssetMiddleware.single('image'), adController.createAd);

// for multiple uploads of the ads
// for now only when we want to added multiple list together
router.post('/upload-multiple-ads', adController.createMultipleAds);

//get all ads
router.get('/get-all-ads', adController.getAllAds);

//get random ad
router.get('/get-random-ad', adController.getRandomAd);

module.exports = router;

