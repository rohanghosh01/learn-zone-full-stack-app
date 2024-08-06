const dbConnection = require("../config/db");
const feedSave = require("../models/feedSave");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const generateUUID = require("../utilities/uuidGenerate");
const feed = require("../models/feed");
(async () => {
  await dbConnection();
})();

let userAttributes = {
  $project: {
    id: "$uid",
    _id: 0,
    // email: 1,
    name: 1,
    userName: 1,
    profileImage: 1,
    createdAt: 1,
  },
};

const feedSaveService = {
  findOne: async (data) => {
    data.deletedAt = null;
    try {
      let result = await feedSave.findOne(data);
      return result ? result : false;
    } catch (err) {
      console.log("DB:error feedLikeService findOne get query Failed.", err);
      return false;
    }
  },

  insert: async (data) => {
    data.uid = generateUUID();
    try {
      let insertData = new feedSave(data);
      const result = await insertData.save();
      return result ? result : false;
    } catch (err) {
      console.log("DB:error feedLikeService insert query Failed.", err);
      return false;
    }
  },
  updateOne: async (where, data) => {
    try {
      let result = await feedSave.updateOne(where, data, {
        runValidators: true,
      });
      return result ? result : false;
    } catch (err) {
      console.log("DB:error feedLikeService updateOne get query Failed.", err);
      return false;
    }
  },
  delete: async (where) => {
    try {
      let result = await feedSave.deleteOne(where);
      return result ? result : false;
    } catch (err) {
      console.log("DB:error feedLikeService delete  query Failed.", err);
      return false;
    }
  },

  getAll: async (data) => {
    try {
      let whereParam = {
        where: {
          deletedAt: null,
        },
      };

      if (data.status) {
        whereParam.where.status = data.status;
      }

      if (data.search) {
        searchParam = {
          deletedAt: null,
          $or: [
            { title: { $regex: data.search, $options: "i" } },
            { description: { $regex: data.search, $options: "i" } },
          ],
        };

        whereParam.where = searchParam;
      }

      let result = await feed.aggregate([
        { $match: whereParam.where },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "uid",
            as: "userInfo",
            pipeline: [userAttributes],
          },
        },
        {
          $lookup: {
            from: "feed_likes",
            let: { feedId: "$uid" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$feedId", "$$feedId"] },
                      { $eq: ["$userId", data.loggedId] },
                    ],
                  },
                },
              },
            ],
            as: "likedInfo",
          },
        },
        {
          $lookup: {
            from: "feed_saves",
            let: { feedId: "$uid" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$feedId", "$$feedId"] },
                      { $eq: ["$userId", data.userId] },
                    ],
                  },
                },
              },
            ],
            as: "savedInfo",
          },
        },
        {
          $project: {
            id: "$uid",
            _id: 0,
            userId: 1,
            title: 1,
            description: 1,
            totalLikes: 1,
            totalComments: 1,
            totalShare: 1,
            totalSaved: 1,
            totalView: 1,
            status: 1,
            content: 1,
            createdAt: 1,
            userInfo: { $arrayElemAt: ["$userInfo", 0] },
            isLiked: {
              $cond: [{ $gt: [{ $size: "$likedInfo" }, 0] }, true, false],
            },
            isSaved: {
              $cond: [{ $gt: [{ $size: "$savedInfo" }, 0] }, true, false],
            }, // Check if user saved the feed
          },
        },
        {
          $match: {
            isSaved: true,
          },
        },
        { $sort: { createdAt: -1 } },
        { $skip: data.offset },
        { $limit: data.limit },
      ]);
      console.log(">>>>>log", result);
      if (result.length) {
        const count = await feed.countDocuments(whereParam.where);
        return { result, count };
      } else {
        return false;
      }
    } catch (err) {
      console.log("DB:error feedService list Failed.", err);
      return false;
    }
  },
};

module.exports = feedSaveService;
