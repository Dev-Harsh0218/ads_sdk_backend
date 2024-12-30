const Ad = require("../models/Ad_model");
const logger = require('../../../core/utils/logger');
const sequelize = require('sequelize');

const adRepository = {
    /**
     * Creates a new ad in the database.
     * @param {Object} adData - The data for the new ad.
     * @returns {Promise<Ad>} - The created ad instance.
     * @throws {Error} - If there is an error creating the ad.
     */
    async createAd(adData) {
        try {
            return await Ad.create(adData);
        } catch (error) {
            logger.error(`Create Ad Error Repository: ${error.message}`);
            throw error;
        }
    },

    /**
     * Creates multiple ads in the database.
     * @param {Object[]} adData - An array of ad data objects to create.
     * @returns {Promise<Ad[]>} - The created ad instances.
     * @throws {Error} - If there is an error creating the ads.
     */
    async createMultipleAds(adData) {
        try {
            return await Ad.bulkCreate(adData);
        } catch (error) {
            logger.error(`Create Multiple Ads Error Repository: ${error.message}`);
            throw error;
        }
    },

    /**
     * Retrieves all ads from the database.
     * @returns {Promise<Ad[]>} - An array of ad instances.
     * @throws {Error} - If there is an error retrieving the ads.
     */
    async getAllAds() {
        try {
            return await Ad.findAll({attributes: ['id', 'ad_asset_path', 'app_link','is_banner'],
                where: { deleted_at: null }
            });
        } catch (error) {
            logger.error(`Get All Ads Error Repository: ${error.message}`);
            throw error;
        }
    },

    /**
     * Retrieves a random ad from the database.
     * @returns {Promise<Ad>} - The retrieved ad instance.
     * @throws {Error} - If there is an error retrieving the ad.
     */
    async getRandomAd(){
        try{
            return await Ad.findOne({
                attributes: ['id', 'ad_asset_path', 'app_link','is_banner'],
                where: { deleted_at: null },
                order: [sequelize.fn('RAND')]
            })
        } catch (error){
            logger.error(`Get Random Ad Error Repository: ${error.message}`);
            throw error;
        }
    },
    
    /**
     * Increments the impression count for the ad with the specified ID.
     * @param {number} id - The ID of the ad to increment the impression count for.
     * @returns {Promise<{ message: string, id: number }>} - An object containing a success message and the ad ID.
     * @throws {Error} - If the ad is not found or the impression count could not be updated.
     */
    async incrementAdImpressionCount(id) {
        try{
            const result = await Ad.increment('impression_count', {
                by: 1,
                where: { id }
            });
            if(result[0][1] !== 1){
                logger.error('Either Ad not or not updated yet');
                throw new Error('Either Ad not or not updated yet');
            }
            else{
                return {"message" : "success", id : id};
            }
        } catch(error){
            logger.error(`Increment Impression Count Error Repository: ${error.message}`);
            throw error;
        }
    },

    /**
     * Increments the click count for the ad with the specified ID.
     * @param {number} id - The ID of the ad to increment the click count for.
     * @returns {Promise<{ message: string, id: number }>} - An object containing a success message and the ad ID.
     * @throws {Error} - If the ad is not found or the click count could not be updated.
     */
    async incrementAdClickCount(id) {
        try {
            // Increment the click count for the ad with the specified ID
            const result = await Ad.increment('click_count', {
                by: 1,
                where: { id }
            });
            if (result[0][1] !== 1) {
                // If the ad is not found or the click count could not be updated, throw an error
                logger.error('Either Ad not found or not updated yet');
                throw new Error('Either Ad not found or not updated yet');
            } else {
                // Return a success message and the ad ID
                return { message: "success", id: id };
            }
        } catch (error) {
            // Log any errors that occur and rethrow the error
            logger.error(`Increment Click Count Error Repository: ${error.message}`);
            throw error;
        }
    },

    /**
     * Retrieves an ad by ID.
     * @param {number} id - The ID of the ad to retrieve.
     * @returns {Promise<Object>} - The ad object.
     * @throws {Error} - If the ad is not found.
     */
    async getAdById(id) {
        try {
            // Retrieve the ad with the specified ID
            const ad = await Ad.findByPk(id);
            if (!ad) {
                // If the ad is not found, throw an error
                throw new Error('Ad not found');
            }
            // Return the ad object
            return ad;
        } catch (error) {
            // Log any errors that occur and rethrow the error
            logger.error(`Get Ad By Id Error Repository: ${error.message}`);
            throw error;
        }
    },

    /**
     * Updates an ad by ID.
     * @param {number} id - The ID of the ad to update.
     * @param {Object} adData - The ad data to update.
     * @returns {Promise<Ad>} - The updated ad instance.
     * @throws {Error} - If the ad is not found.
     */
    async updateAdById(id, adData) {
        try {
            // Update the ad with the specified ID
            const [updated] = await Ad.update(adData, {
                where: { id }
            });
            if (!updated) {
                // If the ad is not found, throw an error
                throw new Error('Ad not found');
            }
            // Return the updated ad instance
            return await Ad.findByPk(id);
        } catch (error) {
            // Log any errors that occur and rethrow the error
            logger.error(`Update Ad Error Repository: ${error.message}`);
            throw error;
        }
    },

    /**
     * Deletes an ad by ID.
     * @param {number} id - The ID of the ad to delete.
     * @returns {Promise<number>} - The number of deleted ads.
     * @throws {Error} - If the ad is not found.
     */
    async deleteAdById(id) {
        try {
            // Delete the ad with the specified ID
            const deleted = await Ad.destroy({
                where: { id }
            });
            if (!deleted) {
                // If the ad is not found, throw an error
                throw new Error('Ad not found');
            }
            // Return the number of deleted ads
            return deleted;
        } catch (error) {
            // Log any errors that occur and rethrow the error
            logger.error(`Delete Ad Error Repository: ${error.message}`);
            throw error;
        }
    }
};
module.exports = adRepository;