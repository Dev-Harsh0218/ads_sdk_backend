const Registered_apk_key = require("../models/Registered_apk_key");
const logger = require('../../../core/utils/logger');
const registerAppRepository = {
    /**
     * Creates a new app record in the database
     * @param {Object} appData - The app data to be stored in the database
     * @returns {Promise<Object>} - The newly created app record
     * @throws {Error} - If there is any error while storing the app data
     */
    async registerApp(appData) {
        try {
            // Create a new app record in the database
            return await Registered_apk_key.create(appData);
        } catch (error) {
            // Log the error and throw it again
            logger.error(`Register App Error Repository: ${error.message}`);
            throw error;
        }
    },

    /**
     * Gets all the registered apps from the database
     * @returns {Promise<Array<Object>>} - An array of all the registered apps
     * @throws {Error} - If there is any error while fetching the apps
     */
    async getAllApps() {
        try {
            // Fetch all the registered apps from the database
            return await Registered_apk_key.findAll({
                attributes: ['app_id','app_name','app_apk_key','app_package_name'],
                where: { deleted_at: null }
            });
        } catch (error) {
            // Log the error and throw it again
            logger.error(`Get All apps Error Repository: ${error.message}`);
            throw error;
        }
    },

    /**
     * Retrieves an app record by its APK key and package name
     * @param {string} app_apk_key - The APK key of the app
     * @param {string} packageName - The package name of the app
     * @returns {Promise<Object>} - The app record if found
     * @throws {Error} - If the app is not found or an error occurs
     */
    async getAppByPackageName(app_apk_key, packageName) {
        try {
            // Find the app in the database by APK key and package name
            const app = await Registered_apk_key.findOne({
                where: { app_apk_key: app_apk_key, app_package_name: packageName }
            });
            // Throw an error if no app is found
            if (!app) {
                throw new Error('App not found');
            }
            // Return the found app record
            return app;
        } catch (error) {
            // Log the error and rethrow it
            logger.error(`Get App By Package Name Error Repository: ${error.message}`);
            throw error;
        }
    },

    /**
     * Increment the impression count for a registered app
     * @param {number} id - The ID of the app to increment the impression count for
     * @throws {Error} - If the app is not found or an error occurs
     * @returns {Promise<Object>} - An object containing a success message and the app ID
     */
    async incrementAppImpressionCount(id) {
        try {
            // Increment the impression count for the app
            const result = await Registered_apk_key.increment('app_impressions', {
                by: 1,
                where: { app_id: id }
            });
            // If the app is not found or the impression count could not be updated, throw an error
            if (result[0][1] !== 1) {
                logger.error('Either App not or not updated yet');
                throw new Error('Either App not or not updated yet');
            } else {
                // Return a success message and the app ID
                return { "message": "success", id: id };
            }
        } catch (error) {
            // Log the error and rethrow it
            logger.error(`Update Impression Count Error Repository: ${error.message}`);
            throw error;
        }
    },

    /**
     * Increments the click count for a registered app
     * @param {number} id - The ID of the app to increment the click count for
     * @throws {Error} - If the app is not found or an error occurs
     * @returns {Promise<Object>} - An object containing a success message and the app ID
     */
    async incrementAppClickCount(id) {
        try {
            // Increment the click count for the app
            const result = await Registered_apk_key.increment('app_clicks', {
                by: 1,
                where: { app_id: id }
            });
            // If the app is not found or the click count could not be updated, throw an error
            if (result[0][1] !== 1) {
                logger.error('Either App not found or not updated yet');
                throw new Error('Either App not found or not updated yet');
            } else {
                // Return a success message and the app ID
                return { "message": "success", id: id };
            }
        } catch (error) {
            // Log the error and rethrow it
            logger.error(`Update Click Count Error Repository: ${error.message}`);
            throw error;
        }
    },

    /**
     * Retrieves an app record by its ID
     * @param {number} id - The ID of the app to retrieve
     * @returns {Promise<Object>} - The app record if found
     * @throws {Error} - If the app is not found or an error occurs
     */
    async getAppById(id) {
        try {
            // Find the app in the database by its ID
            const app = await Registered_apk_key.findByPk(id);
            // Throw an error if no app is found
            if (!app) {
                throw new Error('App not found');
            }
            // Return the found app record
            return app;
        } catch (error) {
            // Log the error and rethrow it
            logger.error(`Get App By Id Error Repository: ${error.message}`);
            throw error;
        }
    },

    /**
     * Updates an app record in the database by its ID
     * @param {number} id - The ID of the app to update
     * @param {Object} appData - The new data to update the app with
     * @returns {Promise<Object>} - The updated app record
     * @throws {Error} - If the app is not found or an error occurs
     */
    async updateAppById(id, appData) {
        try {
            const [updated] = await Registered_apk_key.update(appData, {
                where: { id }
            });
            // Throw an error if the app is not found
            if (!updated) {
                throw new Error('App not found');
            }
            // Return the updated app record
            return await Registered_apk_key.findByPk(id);
        } catch (error) {
            // Log the error and rethrow it
            logger.error(`Update App Error Repository: ${error.message}`);
            throw error;
        }
    },

    /**
     * Deletes an app by its ID
     * @param {number} id - The ID of the app to delete
     * @returns {Promise<number>} - The number of deleted apps
     * @throws {Error} - If the app is not found or an error occurs
     */
    async deleteAppById(id) {
        try {
            // Attempt to delete the app with the specified ID
            const deleted = await Registered_apk_key.destroy({
                where: { id }
            });
            // If no app was deleted, throw an error indicating the app was not found
            if (!deleted) {
                throw new Error('App not found');
            }
            // Return the number of deleted apps
            return deleted;
        } catch (error) {
            // Log any errors that occur and rethrow the error
            logger.error(`Delete App Error Repository: ${error.message}`);
            throw error;
        }
    }
}

module.exports = registerAppRepository