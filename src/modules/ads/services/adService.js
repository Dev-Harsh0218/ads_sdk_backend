const adRepository = require("../repositories/adRepository");
const logger = require('../../../core/utils/logger');

const adService = {
    /**
     * Creates a new ad in the database.
     * @param {Object} adData - Object containing ad data
     * @returns {Promise<Object>} - The created ad
     * @throws {Error} - If the ad data is invalid
     */
    async createAd(adData) {
        try {
            // Validate that required fields are present in the ad data
            if (!adData.ad_asset_path || !adData.app_link) {
                throw new Error('Missing required fields');
            }

            // Create the ad in the database
            return await adRepository.createAd(adData);
        } catch (error) {
            // Log the error
            logger.error(`Service - Create Ad Error: ${error.message}`);
            // Rethrow the error
            throw error;
        }
    },

    /**
     * Creates multiple ads in the database.
     * @param {Array<Object>} adDataList - An array of objects containing ad data
     * @returns {Promise<Array<Object>>} - The created ads
     * @throws {Error} - If the ad data list is invalid
     */
    async createMultipleAds(adDataList) {
        try {
            // Ensure that adDataList is an array with at least one element
            if (!Array.isArray(adDataList) || adDataList.length === 0) {
                throw new Error('Invalid ad data list');
            }

            // Extract and format the ad data from the list
            const formattedAdsData = adDataList.map(([isWhite, adAssetPath, appLink]) => ({
                ad_asset_path: adAssetPath,
                app_link: appLink,
            }));

            // Bulk-create the ads in the database
            return await adRepository.createMultipleAds(formattedAdsData);
        } catch (error) {
            // Log the error
            logger.error(`Service - Create Multiple Ads Error: ${error.message}`);
            // Rethrow the error
            throw error;
        }
    },

    /**
     * Retrieves all ads from the database.
     * @returns {Promise<Array<Object>>} - An array of ad objects
     * @throws {Error} - If there is an error while retrieving the ads
     */
    async getAllAds() {
        try {
            // Call the repository method to get all ads
            return await adRepository.getAllAds();
        } catch (error) {
            // Log the error
            logger.error(`Service - Get All Ads Error: ${error.message}`);
            // Rethrow the error
            throw error;
        }
    },

    /**
     * Retrieves a random ad from the database.
     * @returns {Promise<Ad>} - A random ad object
     * @throws {Error} - If there is an error while retrieving the ad
     */
    async getRandomAd() {
        try {
            // Call the repository method to get a random ad
            return await adRepository.getRandomAd();
        } catch (error) {
            // Log the error
            logger.error(`Service - Get Random Ad Error: ${error.message}`);
            // Rethrow the error
            throw error;
        }
    },

    /**
     * Retrieves an ad by its ID.
     * @param {number} id - The ID of the ad to retrieve.
     * @returns {Promise<Ad>} - The ad object with the specified ID.
     * @throws {Error} - If there is an error retrieving the ad.
     */
    async getAdById(id) {
        try {
            if (!id) {
                throw new Error('Ad ID is required');
            }
            // Call the repository method to get the ad by ID
            return await adRepository.getAdById(id);
        } catch (error) {
            // Log the error
            logger.error(`Service - Get Ad Error: ${error.message}`);
            // Rethrow the error
            throw error;
        }
    },

    /**
     * Updates an ad by its ID.
     * @param {number} id - The ID of the ad to update.
     * @param {Object} adData - The data to update the ad with.
     * @returns {Promise<Ad>} - The updated ad object.
     * @throws {Error} - If there is an error updating the ad.
     */
    async updateAdById(id, adData) {
        try {
            // Check if the ad ID is provided
            if (!id) {
                throw new Error('Ad ID is required');
            }
            // Call the repository method to update the ad by ID
            return await adRepository.updateAdById(id, adData);
        } catch (error) {
            // Log the error
            logger.error(`Service - Update Ad Error: ${error.message}`);
            // Rethrow the error
            throw error;
        }
    },

    /**
     * Deletes an ad by its ID.
     * @param {number} id - The ID of the ad to delete.
     * @returns {Promise<number>} - The number of deleted ads.
     * @throws {Error} - If the ad is not found.
     */
    async deleteAdById(id) {
        try {
            if (!id) {
                throw new Error('Ad ID is required');
            }

            // Call the repository method to delete the ad by ID
            return await adRepository.deleteAdById(id);
        } catch (error) {
            // Log the error
            logger.error(`Service - Delete Ad Error: ${error.message}`);
            // Rethrow the error
            throw error;
        }
    }
};
module.exports = adService;
