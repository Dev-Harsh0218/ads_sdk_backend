// Database Entry point is here
// Here we are connecting to the database
// creating an initial connection without database to check if the DB is present or not
// if not creating the DB only if the connection is successful but there is not db present here
const { Sequelize } = require("sequelize");
const {
  MYSQL_HOST,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_PORT,
  MYSQL_DB_NAME,
} = require("./env");
const logger = require("../core/utils/logger");

//initial connection without database
const initConnection = new Sequelize({
  host: MYSQL_HOST,
  port: MYSQL_PORT,
  username: MYSQL_USER,
  password: MYSQL_PASSWORD,
  dialect: "mysql",
  logging: false,
});

//main connection with database
const sequelize = new Sequelize(MYSQL_DB_NAME, MYSQL_USER, MYSQL_PASSWORD, {
  host: MYSQL_HOST,
  port: MYSQL_PORT,
  dialect: "mysql",
  logging: false,
});

/**
 * Creates the database if it does not exist.
 *
 * @returns {Promise<void>}
 */
const createDatabase = async () => {
  try {
    // Create the database if it does not exist
    await initConnection.getQueryInterface().createDatabase(MYSQL_DB_NAME);
    logger.info("Connection has been established successfully.");
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
    process.exit(1);
  }
};

/**
 * Connect to the database.
 *
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    //creating database if not exists
    await createDatabase();
    //Connecting to the database
    await sequelize
      .authenticate()
      .then(async () => {
        logger.info("Connection has been established successfully.");
        //syncronizing the database with the models
        await sequelize.sync({ force: false });
        logger.success("Database Synced Successfully");
      })
      .catch((error) => {
        logger.error("Unable to connect to the database:", error);
        process.exit(1);
      });
    logger.success("Database connected successfully");
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
