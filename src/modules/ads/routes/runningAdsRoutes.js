/**
 * Express router for running ads related routes.
 */
const express = require('express');
const router = express.Router();
const runningAdsController = require('../controllers/runningAdsController');
// Routes for running ads controller

/**
 * Route for creating a single running ad.
 * Calls the createRunningAd method in runningAdsController.
 */
router.post('/create-running-ad', runningAdsController.createRunningAd);

/**
 * Route for creating multiple running ads.
 * Calls the createMultipleRunnningAds method in runningAdsController.
 */
router.post('/create-running-multiple-ads', runningAdsController.createMultipleRunnningAds);

/**
 * Route for getting all running ads.
 * Calls the getAllRunningAds method in runningAdsController.
 */
router.get('/get-all-running-ads', runningAdsController.getAllRunningAds);

/**
 * Route for deleting a running ad.
 * Calls the deactivateRunningAd method in runningAdsController.
 */
router.delete('/delete-running-ad', runningAdsController.deactivateRunningAd);

/**
 * Route for updating impression count.
 * Calls the incrementImpressionCount method in runningAdsController.
 */
router.put('/increment-ad-impression', runningAdsController.incrementImpressionCount);

/**
 * Route for updating click count.
 * Calls the incrementClickCount method in runningAdsController.
 */
router.put('/increment-ad-click', runningAdsController.incrementClickCount);

/**
 * Route for getting a random ad based on apk unique key.
 * Calls the getRandomAdByApkUniqueKey method in runningAdsController.
 */
router.get('/apkUniqueKey-get-random-ad', runningAdsController.getRandomAdByApkUniqueKey);

module.exports = router;
