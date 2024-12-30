/**
 * Defines a Sequelize model for a registered APK key, which includes fields for the app ID, name, APK key, package name, version, ad count, impressions, clicks, and custom data.
 * 
 * The model has the following properties:
 * - `app_id`: a UUID that serves as the primary key and is unique
 * - `app_name`: the name of the app
 * - `app_apk_key`: the APK key for the app
 * - `app_package_name`: the package name of the app
 * - `app_version`: the version of the app
 * - `ad_count`: the number of ads for the app
 * - `app_impressions`: the number of impressions for the app
 * - `app_clicks`: the number of clicks for the app
 * - `custom`: a JSON field for storing custom data
 * 
 * The model also includes timestamps for creation, update, and deletion (with soft deletes enabled).
 */
const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../config/db");
const Registered_apk_key = sequelize.define('Registered_apk_key',{
    app_id:{type: DataTypes.UUID,defaultValue: DataTypes.UUIDV4,primaryKey: true,unique: true,allowNull: false,validate:{notEmpty:true,notNull:true}},
    app_name: {type: DataTypes.STRING,allowNull: false,validate:{notEmpty:true,notNull:true}},
    app_apk_key:{type: DataTypes.STRING,allowNull: false,validate:{notEmpty:true,notNull:true}},
    app_package_name:{type: DataTypes.STRING,allowNull: false,validate:{notEmpty:true,notNull:true}},
    app_version:{type: DataTypes.STRING,allowNull: false,validate:{notEmpty:true,notNull:true}},
    ad_count:{type:DataTypes.INTEGER,defaultValue: 0},
    app_impressions:{type:DataTypes.INTEGER,defaultValue: 0},
    app_clicks:{type:DataTypes.INTEGER,defaultValue:0},
    custom:{type:DataTypes.JSON,defaultValue:{}},
},{
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    timestamps: true,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'registered_apk_keys',
    indexes: [{unique: true, fields: ['app_id']}]
});

module.exports = Registered_apk_key;