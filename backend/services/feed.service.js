const dbConnection = require("../config/db");
const feed = require("../models/feed");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const generateUUID = require("../utilities/uuidGenerate");

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

const feedService = {
  findOne: async (data) => {
    data.deletedAt = null;
    try {
      let result = await feed.findOne(data);
      return result ? result : false;
    } catch (err) {
      console.log("DB:error feed findOne get query Failed.", err);
      return false;
    }
  },

  insert: async (data) => {
    data.uid = generateUUID();
    try {
      let insertData = new feed(data);
      const result = await insertData.save();
      return result ? result : false;
    } catch (err) {
      console.log("DB:error feed insert query Failed.", err);
      return false;
    }
  },
  updateOne: async (where, data) => {
    try {
      let result = await feed.updateOne(where, data, {
        runValidators: true,
      });
      return result ? result : false;
    } catch (err) {
      console.log("DB:error feed updateOne get query Failed.", err);
      return false;
    }
  },

  feedList: async (data) => {
    try {
      let whereParam = {
        where: {
          deletedAt: null,
        },
      };

      if (data.status) {
        whereParam.where.status = data.status;
      }
      if (data.userId) {
        whereParam.where.userId = data.userId;
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
                      { $eq: ["$userId", data.loggedId] },
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
        { $sort: { createdAt: -1 } },
        { $skip: data.offset },
        { $limit: data.limit },
      ]);

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

  detail: async (uid) => {
    try {
      let where = {
        uid,
        deletedAt: null,
      };

      let userResult = await feed.aggregate([
        {
          $match: where,
        },
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
            from: "feed_comments",
            localField: "uid",
            foreignField: "feedId",
            as: "comments",
            pipeline: [
              {
                $project: {
                  _id: 0,
                  comment: 1,
                  id: "$uid",
                  userId: 1,
                  feedId: 1,
                  parentId: 1,
                  totalLikes: 1,
                  createdAt: 1,
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "comments.userId",
            foreignField: "uid",
            as: "commentsUserInfo",
            pipeline: [userAttributes],
          },
        },
        {
          $project: {
            _id: 0,
            userId: 1,
            id: "$uid",
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
            comments: {
              $map: {
                input: "$comments",
                as: "comment",
                in: {
                  $mergeObjects: [
                    "$$comment",
                    {
                      userInfo: {
                        $arrayElemAt: [
                          "$commentsUserInfo",
                          {
                            $indexOfArray: [
                              "$comments.userId",
                              "$$comment.userId",
                            ],
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      ]);

      if (userResult.length > 0) {
        return userResult[0];
      } else {
        return false;
      }
    } catch (err) {
      console.log("DB:error userService detail Failed.", err);
      return false;
    }
  },

  delete: async (where) => {
    try {
      let result = await feed.deleteOne(where);
      return result ? result : false;
    } catch (err) {
      console.log("DB:error feedService delete  query Failed.", err);
      return false;
    }
  },
};

module.exports = feedService;
