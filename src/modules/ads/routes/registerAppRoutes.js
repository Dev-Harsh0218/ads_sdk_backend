const express = require("express");
const router = express.Router();
const resgisterAppController = require('../controllers/registerAppController');
/**
 * This route is used to register a new app.
 * The app data is expected to be sent in the request body.
 * The app data should contain the following fields:
 *  - name: The name of the app
 *  - package_name: The package name of the app
 *  - version: The version number of the app
 *  - apk_key: The API key for the app
 * The response will contain the app ID and whether the app already existed or not.
 */
router.post('/register-app',resgisterAppController.registerApp);

/**
 * This route is used to get all registered apps.
 * The response will contain an array of all registered apps.
 * Each app will contain the following fields:
 *  - id: The ID of the app
 *  - name: The name of the app
 *  - package_name: The package name of the app
 *  - version: The version number of the app
 *  - apk_key: The API key for the app
 */
router.get('/getAllApps',resgisterAppController.getAllApps);

module.exports = router;
