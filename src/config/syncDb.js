const {sequelize} = require("./db");

/**
 * Sync the database with the models defined in the application.
 *
 * @async
 * @function syncDB
 * @returns {Promise<void>}
 */
const syncDB = async() => {
    try {
        /**
         * Sync the database with the models defined in the application.
         *
         * @param {Object} options - Options for the sync method.
         * @property {boolean} options.force - Whether to drop the existing tables and create new ones.
         */
        await sequelize.sync({force: false});
        console.log("Database Synced Successfully");
    } catch (error) {
        /**
         * Handle any errors that occur during the database sync process.
         *
         * @param {Error} error - The error that occurred.
         */
        console.error(error);
        process.exit(1);
    }
};

syncDB();