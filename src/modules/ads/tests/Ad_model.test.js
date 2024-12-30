const { expect } = require("chai");
const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../config/database");
const Ad = require("../models/Ad_model");

describe("Ad Model", () => {
  before(async () => {
    await sequelize.sync({ force: true });
  });

  afterEach(async () => {
    await Ad.destroy({ where: {}, force: true });
  });

  describe("Create Operations", () => {
    it("should create an ad with all optional fields", async () => {
      const adData = {
        ad_asset_path: "/path/to/asset.jpg",
        app_link: "https://example.com",
        is_banner: true,
        impression_count: 10,
        click_count: 5,
        custom: { theme: "dark", language: "en" }
      };

      const ad = await Ad.create(adData);
      expect(ad).to.include(adData);
    });

    it("should create multiple ads successfully", async () => {
      const adsData = [
        {
          ad_asset_path: "/path/1.jpg",
          app_link: "https://example1.com"
        },
        {
          ad_asset_path: "/path/2.jpg",
          app_link: "https://example2.com"
        }
      ];

      const ads = await Ad.bulkCreate(adsData);
      expect(ads).to.have.lengthOf(2);
    });
  });

  describe("Validation Tests", () => {
    it("should fail with empty asset path string", async () => {
      const adData = {
        ad_asset_path: "",
        app_link: "https://example.com"
      };

      try {
        await Ad.create(adData);
        expect.fail("Should have thrown validation error");
      } catch (error) {
        expect(error.message).to.include("Ad asset path is required");
      }
    });

    it("should fail with invalid impression count", async () => {
      const adData = {
        ad_asset_path: "/path/to/asset.jpg",
        app_link: "https://example.com",
        impression_count: -1
      };

      try {
        await Ad.create(adData);
        expect.fail("Should have thrown validation error");
      } catch (error) {
        expect(error.message).to.include("Validation error");
      }
    });
  });

  describe("Update Operations", () => {
    let testAd;

    beforeEach(async () => {
      testAd = await Ad.create({
        ad_asset_path: "/path/to/asset.jpg",
        app_link: "https://example.com"
      });
    });

    it("should increment impression count atomically", async () => {
      await testAd.increment('impression_count', { by: 1 });
      const updated = await Ad.findByPk(testAd.id);
      expect(updated.impression_count).to.equal(1);
    });

    it("should update multiple fields simultaneously", async () => {
      const updates = {
        is_banner: true,
        custom: { category: "games" },
        app_link: "https://updated-example.com"
      };

      await testAd.update(updates);
      const updated = await Ad.findByPk(testAd.id);
      expect(updated).to.include(updates);
    });
  });

  describe("Query Operations", () => {
    beforeEach(async () => {
      await Ad.bulkCreate([
        {
          ad_asset_path: "/banner1.jpg",
          app_link: "https://example1.com",
          is_banner: true,
          impression_count: 100
        },
        {
          ad_asset_path: "/banner2.jpg",
          app_link: "https://example2.com",
          is_banner: true,
          impression_count: 50
        },
        {
          ad_asset_path: "/video1.mp4",
          app_link: "https://example3.com",
          is_banner: false,
          impression_count: 75
        }
      ]);
    });

    it("should find ads by banner type", async () => {
      const bannerAds = await Ad.findAll({
        where: { is_banner: true }
      });
      expect(bannerAds).to.have.lengthOf(2);
    });

    it("should order ads by impression count", async () => {
      const orderedAds = await Ad.findAll({
        order: [['impression_count', 'DESC']]
      });
      expect(orderedAds[0].impression_count).to.equal(100);
    });
  });

  describe("Soft Delete Operations", () => {
    it("should not include deleted records in normal queries", async () => {
      const ad = await Ad.create({
        ad_asset_path: "/test.jpg",
        app_link: "https://example.com"
      });

      await ad.destroy();
      const allAds = await Ad.findAll();
      expect(allAds).to.have.lengthOf(0);
    });

    it("should restore soft-deleted records", async () => {
      const ad = await Ad.create({
        ad_asset_path: "/test.jpg",
        app_link: "https://example.com"
      });

      await ad.destroy();
      await ad.restore();
      const restoredAd = await Ad.findByPk(ad.id);
      expect(restoredAd).to.not.be.null;
      expect(restoredAd.deleted_at).to.be.null;
    });
  });
});
