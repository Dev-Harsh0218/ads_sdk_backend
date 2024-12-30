/**
 * The main application file.
 * This file sets up the express server, connects to the database, and mounts the routes.
 * @module server
 */

const path = require('path');
const cors = require('cors');
const express = require('express');
const {connectDB, checkDBExists} = require('./src/config/db');
const logger = require('./src/core/utils/logger');
const {PORT} = require('./src/config/env');

// Importing routes
const adRoutes = require('./src/modules/ads/routes/adRoutes');
const appRoutes = require('./src/modules/ads/routes/registerAppRoutes');
const runningAdsRoutes = require('./src/modules/ads/routes/runningAdsRoutes');

// Initializing the app
const app = express();

// Connecting to the database
connectDB();

// CORS
app.use(cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Static routes
app.use('/images',express.static(path.join(__dirname,'/public/uploads/images')));
app.use('/videos',express.static(path.join(__dirname,'/public/uploads/videos')));

// Ad routes
app.use('/api/v1/ads',adRoutes);
// App routes
app.use('/api/v1/apps',appRoutes);
// Running ads routes
app.use('/api/v1/run-ads',runningAdsRoutes);

// Health ping
/**
 * A simple health check route.
 * @name /health-ping
 * @function
 * @inner
 * @param {IncomingMessage} req The request object.
 * @param {ServerResponse} res The response object.
 */
app.get('/health-ping',(req,res) => res.status(200).json({success:"Ads_sdk_server ====> running"}));

// Starting the server
app.listen(PORT,()=>{
    logger.info(`Server is running on PORT: ${PORT}`);
});
