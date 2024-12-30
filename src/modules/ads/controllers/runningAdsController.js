const runningAdsService = require("../services/runningAdsService");
const runningAdsController = {
  /**
   * Controller method to create a new running ad.
   * @param {Object} req - The request object containing the ad data.
   * @param {Object} res - The response object for sending the result.
   * @returns {Promise<void>} - A promise that resolves when the ad is created.
   */
  async createRunningAd(req, res) {
    try {
      // Call the service method to create the ad
      const result = await runningAdsService.createRunningAd(req.body);
      // Return the response with the created ad data
      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      // Handle any errors that occur during the process
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  },

  /**
   * Controller for creating multiple running ads.
   * @param {Object} req - The request object containing the app ID and ad ID list.
   * @param {string} req.body.app_id - The ID of the app for which the ads are being created.
   * @param {Array} req.body.adslistData - The list of ad IDs to be created.
   * @param {Object} res - The response object for sending the result.
   * @returns {Promise<void>}
   */
  async createMultipleRunnningAds(req, res) {
    try {
      const { app_id, adslistData } = req.body;
      if (!app_id || !adslistData) {
        throw new Error("App ID and Ad Id list are required");
      }
      // Call the service method to create the ads
      const result = await runningAdsService.createMultipleRunningAds(
        app_id,
        adslistData
      );
      // Return the response with the created ad data
      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      // Handle any errors that occur during the process
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  },

  /**
   * Controller for fetching a random ad based on the Apk Unique Key.
   * @param {Object} req - The request object containing the Apk Unique Key.
   * @param {string} req.query.apk_unique_key - The Apk Unique Key to fetch the random ad for.
   * @param {Object} res - The response object for sending the result.
   * @returns {Promise<void>}
   */
  async getRandomAdByApkUniqueKey(req, res) {
    try {
      // retrieve the apk unique key from query parameters
      const { apk_unique_key } = req.query;
      // Get a random ad from the database based on the Apk Unique Key
      const ad = await runningAdsService.getRandomAdByApkUniqueKey(
        apk_unique_key
      );
      // Transform the response to include only the required fields
      const transformedResponse = {
        randomImage: ad.Ad.ad_asset_path,
        appurl: ad.Ad.app_link,
        ad_id: ad.id,
      };
      // Send the response with the transformed ad data
      res.status(200).json({
        message: "success",
        data: transformedResponse,
      });
    } catch (error) {
      // Handle any errors that occur during the process
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  },

  /**
   * Controller for fetching all running ads.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   * @returns {Promise<void>}
   */
  async getAllRunningAds(req, res) {
    try {
      // Fetch all running ads from the service
      const ads = await runningAdsService.getAllRunningAds();

      // Check if ads are returned and send response accordingly
      if (ads) {
        res.status(200).json({
          success: true,
          data: ads,
        });
      } else {
        res.status(200).json([]);
      }
    } catch (error) {
      // Handle any errors that occur during the process
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  },

  /**
   * Controller for incrementing the impression count of a running ad.
   * @param {Object} req - The request object containing the running ad ID.
   * @param {string} req.body.running_ad_id - The ID of the running ad to increment the impression count for.
   * @param {Object} res - The response object for sending the result.
   * @returns {Promise<void>}
   */
  async incrementImpressionCount(req, res) {
    try {
      // Get the running ad ID from the request body
      const { running_ad_id } = req.body;

      // Call the service method to increment impression count
      const result = await runningAdsService.incrementImpressionCount(
        running_ad_id
      );

      // Send the result back as a response
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      // Handle any errors that occur during the process
      // and send the error message as a response
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  },

  /**
   * Controller for incrementing the click count of a running ad.
   * @param {Object} req - The request object containing the running ad ID.
   * @param {string} req.body.running_ad_id - The ID of the running ad to increment the click count for.
   * @param {Object} res - The response object for sending the result.
   * @returns {Promise<void>}
   */
  async incrementClickCount(req, res) {
    try {
      // Get the running ad ID from the request body
      const { running_ad_id } = req.body;

      // Call the service method to increment click count
      const result = await runningAdsService.incrementClickCount(running_ad_id);

      // Send the result back as a response
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      // Handle any errors that occur during the process
      // and send the error message as a response
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  },

  /**
   * Retrieves all running ads associated with the specified app ID.
   * @param {Object} req - The request object containing the app ID.
   * @param {string} req.params.appId - The ID of the app to retrieve running ads for.
   * @param {Object} res - The response object for sending the result.
   * @returns {Promise<void>}
   */
  async getRunningAdsByAppId(req, res) {
    try {
      // retrieve the app ID from the request parameters
      const { appId } = req.params;
      // get all running ads associated with the app from the service
      const ads = await runningAdsService.getRunningAdsByAppId(appId);
      // send the result back as a response
      res.status(200).json({
        success: true,
        data: ads,
      });
    } catch (error) {
      // handle any errors that occur during the process
      // and send the error message as a response
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  },

  /**
   * Deactivates a running ad.
   * @param {Object} req - The request object containing the running ad ID.
   * @param {string} req.body.id - The ID of the running ad to deactivate.
   * @param {Object} res - The response object for sending the result.
   * @returns {Promise<void>}
   */
  async deactivateRunningAd(req, res) {
    try {
      // Extract the running ad ID from the request body
      const { id } = req.body;

      // Call the service method to deactivate the running ad
      await runningAdsService.deactivateRunningAd(id);

      // Send a success response
      res.status(200).json({
        success: true,
        message: "Ad deactivated successfully",
      });
    } catch (error) {
      // Handle any errors that occur during the process
      // and send the error message as a response
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  },
};

module.exports = runningAdsController;
