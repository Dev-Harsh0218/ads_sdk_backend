const runningAdsRepository = require("../repositories/runningAdsRepository");
const logger = require('../../../core/utils/logger');
const adRepository = require("../repositories/adRepository");
const registerAppRepository = require('../repositories/registerAppRepository');
const { sequelize } = require("../../../config/db");

const runningAdsService = {
   /**
     * Creates a new running ad
     * @param {Object} runningAdData - object containing app_id and ad_id
     * @returns {Promise<Object>} - created running ad
     */
    async createRunningAd(runningAdData) {
        try {
            if (!runningAdData.app_id || !runningAdData.ad_id) {
                throw new Error('App ID and Ad ID are required');
            }

            return await runningAdsRepository.createRunningAd(runningAdData);
        } catch (error) {
            logger.error(`Service - Create Running Ad Error: ${error.message}`);
            throw error;
        }
    },

    /**
     * Creates multiple running ads in the database
     * @param {number} app_id - The ID of the app
     * @param {Array<Object>} adsListData - An array of objects containing ad data
     * @throws {Error} If the app ID and ad data are not provided
     * @throws {Error} If the ad data is not an array
     * @returns {Promise<Array<Object>>} - The created running ads
     */
    async createMultipleRunningAds(app_id, adsListData) {
        try{
            if(!app_id || !adsListData || !Array.isArray(adsListData)) {
                throw new Error('App ID and Ad Id list are required');
            }
            const runningAdData = adsListData.map(ad => ({
                app_id: app_id,
                ad_id: ad.id
            }));
            const result = await runningAdsRepository.createMultipleRunningAds(runningAdData);
            return result;
        } catch(error){
            logger.error(`Service - Create Multiple Running Ads Error: ${error.message}`);
            throw error;
        }
    },

    /**
     * Increment the impression count for a running ad and its associated ad and app
     * @param {number} running_ad_id - The ID of the running ad
     * @throws {Error} If the running ad ID is not provided
     * @throws {Error} If the running ad is not found or inactive
     * @returns {Promise<void>}
     */
    async incrementImpressionCount(running_ad_id) {
        if (!running_ad_id) {
            throw new Error('Running Ad ID is required');
        }
        try {
            //get the running ad details to access app_id and ad_id
            const running_ad = await runningAdsRepository.getRunningAdById(running_ad_id);
            if (!running_ad || !running_ad.is_active) {
                throw new Error('Running Ad not found or inactive');
            }
            //use Transaction to ensure data consistency
            const transaction = await sequelize.transaction();
            try {
                //Increment the impressions for the running ad, associated ad, and associated app
                const result = await Promise.all([
                    runningAdsRepository.incrementRuningAdImpressionCount(running_ad_id),
                    adRepository.incrementAdImpressionCount(running_ad.ad_id),
                    registerAppRepository.incrementAppImpressionCount(running_ad.app_id)
                ]);
                await transaction.commit();
                return result;
            } catch (error) {
                await transaction.rollback();
                logger.error(`Service - Increment Impression Count Error: ${error.message}`);
                throw error;
            }
        } catch (error) {
            logger.error(`Service - Increment Impression Count Error: ${error.message}`);
            throw error;
        }
    },

    /**
     * Increment the click count for a running ad and its associated ad and app
     * @param {number} running_ad_id - The ID of the running ad
     * @throws {Error} If the running ad ID is not provided
     * @throws {Error} If the running ad is not found or inactive
     * @returns {Promise<void>}
     */
    async incrementClickCount(running_ad_id) {
        if (!running_ad_id) {
            throw new Error('Running Ad ID is required');
        }
        try {
            //get the running ad details to access app_id and ad_id
            const running_ad = await runningAdsRepository.getRunningAdById(running_ad_id);
            if (!running_ad || !running_ad.is_active) {
                throw new Error('Running Ad not found or inactive');
            }
            //use Transaction to ensure data consistency
            const transaction = await sequelize.transaction();
            try{
                //Increment the click count for the running ad, associated ad, and associated app
                const result = await Promise.all([
                    runningAdsRepository.incrementRunningAdClickCount(running_ad_id),
                    adRepository.incrementAdClickCount(running_ad.ad_id),
                    registerAppRepository.incrementAppClickCount(running_ad.app_id)
                ])
                //if all the operations are done successfully, commit the transaction
                await transaction.commit();
                return result;
            } catch(error){
                //if there is an error in any of the operations, rollback the transaction
                await transaction.rollback();
                logger.error(`Service - Increment Click Count Error: ${error.message}`);
                throw error;
            }
        } catch (error) {
            logger.error(`Service - Increment Click Count Error: ${error.message}`);
            throw error;
        }
    },

    /**
     * Gets all running ads
     * @returns {Promise<Array<Object>>} - list of all running ads
     */
    async getAllRunningAds() {
        try {
            //get all running ads from the database
            return await runningAdsRepository.getAllRunningAds();
        } catch (error) {
            //log the error and rethrow it
            logger.error(`Service - Get All Running Ads Error: ${error.message}`);
            throw error;
        }
    },
    
    /**
     * Gets a random ad based on the Apk Unique Key
     * @param {string} app_id - The Apk Unique Key
     * @returns {Promise<Object>} - a random ad
     */
    async getRandomAdByApkUniqueKey(app_id) {
        if (!app_id) {
            throw new Error('Apk Unique Key is required');
        }
        try {
            //get a random running ad from the database
            return await runningAdsRepository.getRandomAdByApkUniqueKey(app_id);
        } catch (error) {
            //log the error and rethrow it
            logger.error(`Service - Get Random Ad By Apk Unique Key Error: ${error.message}`);
            throw error;
        }  
    },

    /**
     * Gets all running ads associated with an app
     * @param {number} appId - The ID of the app
     * @throws {Error} If the app ID is not provided
     * @returns {Promise<Array<Object>>} - list of all running ads associated with the app
     */
    async getRunningAdsByAppId(appId) {
        try {
            if (!appId) {
                throw new Error('App ID is required');
            }
            //get all running ads associated with the app from the database
            return await runningAdsRepository.getRunningAdsByAppId(appId);
        } catch (error) {
            //log the error and rethrow it
            logger.error(`Service - Get Running Ads Error: ${error.message}`);
            throw error;
        }
    },

    /**
     * Deactivates a running ad
     * @param {number} id - The ID of the running ad
     * @throws {Error} If the running ad ID is not provided
     * @returns {Promise<Object>} - the deactivated running ad
     */
    async deactivateRunningAd(id) {
        try {
            if (!id) {
                throw new Error('Running Ad ID is required');
            }
            //deactivate the running ad in the database
            return await runningAdsRepository.deactivateRunningAd(id);
        } catch (error) {
            //log the error and rethrow it
            logger.error(`Service - Deactivate Running Ad Error: ${error.message}`);
            throw error;
        }
    }
};

module.exports = runningAdsService;
