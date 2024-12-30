const Running_ad = require("../models/Running_ads_model");
const Ad = require("../models/Ad_model");
const Registered_apk_key = require("../models/Registered_apk_key");
const logger = require("../../../core/utils/logger");
const { Sequelize } = require('sequelize');

const runningAdsRepository = {
  /**
   * Creates a new running ad in the database.
   * @param {Object} runningAdData - The data for the new running ad.
   * @returns {Promise<Object>} - The created running ad instance.
   * @throws {Error} - If there is an error creating the running ad.
   */
  async createRunningAd(runningAdData) {
    try {
      // Create a new running ad record in the database
      return await Running_ad.create(runningAdData);
    } catch (error) {
      // Log the error and rethrow it
      logger.error(`Create Running Ad Error Repository: ${error.message}`);
      throw error;
    }
  },

  /**
   * Creates multiple running ads in the database.
   * @param {Array<Object>} runningAdData - An array of objects containing the data for the new running ads.
   * @returns {Promise<Array<Object>>} - The created running ads instances.
   * @throws {Error} - If there is an error creating the running ads.
   */
  async createMultipleRunningAds(runningAdData) {
    try {
      // Create multiple running ads records in the database using bulk create
      // The `updateOnDuplicate` option is used to update the existing records that have been soft deleted
      const result = await Running_ad.bulkCreate(runningAdData, {
        validate: true,
        updateOnDuplicate: ["is_active", "deleted_at", "updated_at"],
        where: {
          is_active: false,
        },
      });
      return result;
    } catch (error) {
      // Log the error and rethrow it
      logger.error(
        `Create Multiple Running Ads Error Repository: ${error.message}`
      );
      throw error;
    }
  },

  /**
   * Gets a random running ad by app id.
   * @param {string} app_id - The id of the app to get the ad for.
   * @returns {Promise<Object>} - The running ad instance.
   * @throws {Error} - If there is an error getting the ad.
   */
  async getRandomAdByApkUniqueKey(app_id){
    try{
      // Get a random running ad record from the database based on the app id
      // The `order` option is used to order the records randomly
      // The `include` option is used to include the associated ad and app records
      return await Running_ad.findOne({
        where: {
          app_id: app_id,
          is_active: true,
        },
        // Order the records randomly
        order: [[Sequelize.fn('RAND')]],
        // Include the associated ad and app records
        include: [{ model: Ad }, { model: Registered_apk_key }],
      });
    } catch(error) {
      // Log the error and rethrow it
      logger.error(`Get Random Ad By Apk Unique Key Error Repository: ${error.message}`);
      throw error;
    }
  },


  /**
   * Retrieves all the running ads from the database.
   * @returns {Promise<Array<Object>>} - An array of running ad instances.
   * @throws {Error} - If there is an error retrieving the running ads.
   */
  async getAllRunningAds() {
    try {
      // Retrieve all the running ads from the database
      // The `attributes` option is used to select the columns to include in the result
      // The `where` option is used to filter the records based on the `is_active` column
      // The `include` option is used to include the associated ad and app records
      return await Running_ad.findAll({
        attributes: ['id', 'app_id', 'ad_id','impression_count','click_count'],
        where: {
          is_active: true,
        },
        include: [{ 
          model: Ad, 
          attributes: ['ad_asset_path','app_link'] 
        }, { 
          model: Registered_apk_key, 
          attributes: ['app_name'] 
        }],
      });
    } catch (error) {
      // Log the error and rethrow it
      logger.error(`Get All Running Ads Error Repository: ${error.message}`);
      throw error;
    }
  },

  /**
   * Retrieves a running ad by its ID.
   * @param {number} id - The ID of the running ad to retrieve.
   * @returns {Promise<Object>} - The running ad instance with the specified ID.
   * @throws {Error} - If there is an error retrieving the running ad.
   */
  async getRunningAdById(id) {
    try {
      const result = await Running_ad.findByPk(id, {
        attributes: ['app_id', 'ad_id', 'is_active'],
        where: {
          is_active: true,
        },
        // include: [{ model: Ad }, { model: Registered_apk_key }],
      });
      return result;
    } catch (error) {
      logger.error(`Get Running Ad By Id Error Repository: ${error.message}`);
      throw error;
    }
  },

  /**
   * Retrieves all running ads associated with an app.
   * @param {number} appId - The ID of the app.
   * @returns {Promise<Array<Object>>} - An array of running ad instances associated with the app.
   * @throws {Error} - If there is an error retrieving the running ads.
   */
  async getRunningAdByAppId(appId) {
    try {
      // Find all running ads associated with the app in the database
      return await Running_ad.findAll({
        where: {
          app_id: appId,
          is_active: true,
        },
        // Include the associated ad and app data
        include: [{ model: Ad }, { model: Registered_apk_key }],
      });
    } catch (error) {
      // Log the error and rethrow it
      logger.error(`Get Running Ads Error Repository: ${error.message}`);
      throw error;
    }
  },

  /**
   * Increments the impression count for a running ad.
   * @param {number} id - The ID of the running ad to increment the impression count for.
   * @returns {Promise<Object>} - An object containing a success message and the running ad ID.
   * @throws {Error} - If the running ad is not found or an error occurs.
   */
  async incrementRuningAdImpressionCount(id){
    try {
      // Increment the impression count for the running ad
      const result = await Running_ad.increment('impression_count', {
        by: 1,
        where: { id },
      });

      // Check if the running ad was found and the impression count was updated
      if(result[0][1] !== 1){
        logger.error('Either Ad not found or not updated yet');
        throw new Error('Either Ad not found or not updated yet');
      } else {
        // Return a success message and the running ad ID
        return {"message" : "success",id : id};
      } 

    } catch(error){
       // Log the error and rethrow it
       logger.error(`Update Impression count Error Repository: ${error.message}`);
       throw error;
    }
  },

  /**
   * Increments the click count for a running ad.
   * @param {number} id - The ID of the running ad to increment the click count for.
   * @returns {Promise<Object>} - An object containing a success message and the running ad ID.
   * @throws {Error} - If the running ad is not found or an error occurs.
   */
  async incrementRunningAdClickCount(id) {
    try {
      // Increment the click count for the running ad
      const result = await Running_ad.increment('click_count', {
        by: 1,
        where: { id },
      });

      // Check if the running ad was found and the click count was updated
      if (result[0][1] !== 1) {
        logger.error('Either Ad not found or not updated yet');
        throw new Error('Either Ad not found or not updated yet');
      } else {
        // Return a success message and the running ad ID
        return { message: "success", id: id };
      }
    } catch (error) {
      // Log the error and rethrow it
      logger.error(`Update Click count Error Repository: ${error.message}`);
      throw error;
    }
  },

  /**
   * Updates a running ad with the provided data.
   * @param {number} id - The ID of the running ad to update.
   * @param {Object} updateData - The data to update the running ad with.
   * @returns {Promise<Object>} - The updated running ad instance.
   * @throws {Error} - If the running ad is not found or an error occurs.
   */
  async updateRunningAd(id, updateData) {
    try {
      return await Running_ad.update(updateData, {
        where: { id },
      });
    } catch (error) {
      logger.error(`Update Running Ad Error Repository: ${error.message}`);
      throw error;
    }
  },

  /**
   * Deactivates a running ad.
   * @param {number} id - The ID of the running ad to deactivate.
   * @returns {Promise<Object>} - The updated running ad instance.
   * @throws {Error} - If the running ad is not found or an error occurs.
   */
  async deactivateRunningAd(id) {
    try {
      // Update the running ad with the is_active field set to false
      // and deleted_at field set to the current date and time
      return await Running_ad.update(
        { is_active: false, deleted_at: new Date() },
        { where: { id } }
      );
    } catch (error) {
      // Log the error and rethrow it
      logger.error(`Deactivate Running Ad Error Repository: ${error.message}`);
      throw error;
    }
  },
};

module.exports = runningAdsRepository;
