const adService = require('../services/adService');
const path = require('path');
const adController = {
    /**
     * Creates a new advertisement.
     * @param {Object} req - The request object containing ad data.
     * @param {Object} res - The response object for sending the result.
     * @returns {void}
     */
    async createAd(req, res) {
        try {
            // Destructure necessary fields from the request body
            const { appUrl, isBanner } = req.body;

            // Validate that appUrl is provided
            if (!appUrl) {
                return res.status(400).json({ error: "appUrl is required" });
            }

            // Validate that a file is provided
            if (!req.file) {
                return res.status(400).json({ error: "No image file provided" });
            }

            // Construct the ad asset path from the uploaded file
            const adAssetPath = path.basename(req.file.path);

            // Prepare ad data for database insertion
            const adData = {
                ad_asset_path: adAssetPath,
                app_link: appUrl,
                is_banner: Boolean(parseInt(isBanner)),
            };

            // Write the ad data to the database
            await adService.createAd(adData);
            res.status(200).json({ success: "Ad created successfully" });

        } catch (error) {
            // Handle any errors that occur during the process
            return res.status(500).json({ error: "something went wrong" });
        }
    },

    /**
     * Controller for bulk creating a list of ads.
     * @param {Object} req - The request object containing ad data.
     * @param {Object} res - The response object for sending the result.
     * @returns {void}
     */
    async createMultipleAds(req, res) {
        try {
            // Validate that ads data is present in the request body
            const { adsData } = req.body;
            if (!adsData || !Array.isArray(adsData)) {
                return res.status(400).json({ error: "Valid ads data array is required" });
            }

            // Call the service method to create the ads
            await adService.createMultipleAds(adsData);
            res.status(200).json({ success: "Ads created successfully" });

        } catch (error) {
            // Handle any errors that occur during the process
            res.status(500).json({ error: "something went wrong" });
        }
    },

    /**
     * Controller for getting a random ad.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object for sending the result.
     * @returns {void}
     */
    async getRandomAd(req,res){
        try{
            // Get a random ad from the database
            const ad = await adService.getRandomAd();

            // Return the ad as the response
            res.status(200).json({ad: ad});
        } catch (error){
            // Handle any errors that occur during the process
            res.status(500).json({error:"something went wrong"});
        }
    },

    /**
     * Controller for retrieving all ads.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object for sending the result.
     * @returns {void}
     */
    async getAllAds(req, res) {
        try {
            // Fetch all ads from the service
            const ads = await adService.getAllAds();

            // Check if ads are returned and send response accordingly
            if (ads) {
                res.status(200).json({ ads: ads });
            } else {
                res.status(200).json([]);
            }
        } catch (error) {
            // Handle any errors that occur during the process
            res.status(500).json({ error: "Something went wrong" });
        }
    }
}

module.exports = adController