/**
 * Defines the Ad model for the application's ads.
 * 
 * The Ad model represents an advertisement in the application. It has the following properties:
 * - `id`: a unique UUID identifier for the ad
 * - `ad_asset_path`: the file path to the ad's asset (e.g. image, video)
 * - `app_link`: the URL that the ad should link to when clicked
 * - `is_banner`: a boolean indicating whether the ad is a banner ad
 * - `impression_count`: the number of times the ad has been displayed
 * - `click_count`: the number of times the ad has been clicked
 * - `custom`: a JSON object for storing any custom data associated with the ad
 * 
 * The model also includes timestamps for creation, update, and deletion (if the ad is soft-deleted).
 */
const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../config/db");
const Ad = sequelize.define('Ad',{
    id:{type: DataTypes.UUID,defaultValue: DataTypes.UUIDV4,primaryKey: true,unique: true},
    ad_asset_path: {type: DataTypes.STRING,allowNull: false,validate:{notEmpty:true}},
    app_link:{type:DataTypes.STRING,allowNull:false,validate:{notEmpty:true,isUrl:true}},
    is_banner: {type:DataTypes.BOOLEAN,defaultValue: false},
    impression_count:{type:DataTypes.INTEGER,defaultValue: 0},
    click_count:{type:DataTypes.INTEGER,defaultValue:0},
    custom:{type:DataTypes.JSON,defaultValue:{}},
},{
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    timestamps: true,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'ads',
    indexes: [{unique: true, fields: ['id']}],
    validate:{
        validateAssetPath(){
            const allowedExt = ['.jpg','.jpeg','.png','.gif','.mp4','.webp'];
            if(!this.ad_asset_path || !allowedExt.some(ext=>this.ad_asset_path.toLowerCase().endsWith(ext))) {
                logger.error('Invalid asset path or extension not allowed or asset path not provided is not valid');
                throw new Error('Invalid asset path')
            }
        },
        validateAppLink(){
            if(!this.app_link) throw new Error('App link is required')
        }
    }
});

module.exports = Ad;