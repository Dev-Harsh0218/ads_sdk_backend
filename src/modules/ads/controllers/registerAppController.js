const registerAppService = require('../services/registerAppService');
/**
 * Handles the registration of new apps and retrieval of all registered apps.
 */
const registerAppController = {
    /**
     * Registers a new app and returns the result.
     * @param {Object} req - The request object containing the app data.
     * @param {Object} res - The response object to send the registration result.
     * @returns {void}
     */
    async registerApp(req, res) {
        try {
            const result = await registerAppService.registerApp(req.body);
            const message = result.existing ? 'App already Registered' : 'App registered successfully';
            res.status(200).json({
                success: true,
                message,
                data: result
            });
            
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    },
    /**
     * Retrieves all registered apps.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object for sending the result.
     * @returns {void}
     */
    
    async getAllApps(req, res) {
        try {
            // Get all registered apps from the service
            const apps = await registerAppService.getAllApps();
            // Send the response with the list of apps
            res.status(200).json({
                success: true,
                data: apps
            });
        } catch (error) {
            // Handle any errors that occur during the process
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    },
}  

module.exports = registerAppController
