require('dotenv').config()
module.exports = {
    //exposing server on the PORT
    PORT: process.env.PORT || 8000,
    // DB settings
    MYSQL_HOST: process.env.MYSQL_HOST || 'localhost',
    MYSQL_USER: process.env.MYSQL_USER || 'root',
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD || 'Harsh@app@24',
    MYSQL_PORT: process.env.MYSQL_PORT || '3306',
    MYSQL_DB_NAME: process.env.MYSQL_DB_NAME || 'ads_sdk',
}

