const dbConnection = require("../config/db");
const feedComment = require("../models/feedComment");
const feedCommentLike = require("../models/feedCommentLike");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const generateUUID = require("../utilities/uuidGenerate");
(async () => {
  await dbConnection();
})();

const feedCommentService = {
  findOne: async (data) => {
    data.deletedAt = null;
    try {
      let result = await feedComment.findOne(data);
      return result ? result : false;
    } catch (err) {
      console.log("DB:error feedCommentService findOne get query Failed.", err);
      return false;
    }
  },

  insert: async (data) => {
    data.uid = generateUUID();
    try {
      let insertData = new feedComment(data);
      const result = await insertData.save();
      return result ? result : false;
    } catch (err) {
      console.log("DB:error feedCommentService insert query Failed.", err);
      return false;
    }
  },
  updateOne: async (where, data) => {
    try {
      let result = await feedComment.updateOne(where, data, {
        runValidators: true,
      });
      return result ? result : false;
    } catch (err) {
      console.log(
        "DB:error feedCommentService updateOne get query Failed.",
        err
      );
      return false;
    }
  },
  delete: async (where) => {
    try {
      let result = await feedComment.deleteOne(where);
      return result ? result : false;
    } catch (err) {
      console.log("DB:error feedCommentService delete  query Failed.", err);
      return false;
    }
  },

  getAll: async (data) => {
    console.log(">>>>>log", data);
    try {
      let whereParam = {
        where: {
          deletedAt: null,
          feedId: data.feedId,
          parentId: null,
        },
      };

      if (data.status) {
        whereParam.where.status = data.status;
      }

      if (data.search) {
        searchParam = {
          deletedAt: null,
          $or: [{ comment: { $regex: data.search, $options: "i" } }],
        };

        whereParam.where = searchParam;
      }

      let result = await feedComment.aggregate([
        { $match: whereParam.where },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "uid",
            as: "userInfo",
            pipeline: [
              {
                $project: {
                  id: "$uid",
                  _id: 0,
                  // email: 1,
                  name: 1,
                  userName: 1,
                  profileImage: 1,
                  createdAt: 1,
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "feeds",
            localField: "feedId",
            foreignField: "uid",
            as: "feedInfo",
            pipeline: [
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
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "feed_comments",
            let: { parentId: "$uid" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$parentId", "$$parentId"] }, // Match parentId with current comment's id
                },
              },
              {
                $lookup: {
                  from: "users",
                  localField: "userId",
                  foreignField: "uid",
                  as: "userInfo",
                  pipeline: [
                    {
                      $project: {
                        id: "$uid",
                        _id: 0,
                        // email: 1,
                        name: 1,
                        userName: 1,
                        profileImage: 1,
                        createdAt: 1,
                      },
                    },
                  ],
                },
              },
              {
                $project: {
                  id: 1,
                  comment: 1,
                  userId: 1,
                  parentId: 1,
                  totalLikes: 1,
                  createdAt: 1,
                  userInfo: { $arrayElemAt: ["$userInfo", 0] },
                },
              },
            ],
            as: "replies",
          },
        },
        {
          $lookup: {
            from: "feed_comment_likes",
            let: {
              commentId: "$uid",
              userId: data.userId,
              feedId: data.feedId,
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$commentId", "$$commentId"] },
                      { $eq: ["$userId", "$$userId"] },
                      { $eq: ["$feedId", "$$feedId"] },
                    ],
                  },
                },
              },
            ],
            as: "likedInfo",
          },
        },
        {
          $project: {
            id: "$uid",
            _id: 0,
            comment: 1,
            userId: 1,
            feedId: 1,
            parentId: 1,
            totalLikes: 1,
            createdAt: 1,
            userInfo: { $arrayElemAt: ["$userInfo", 0] },
            feedInfo: { $arrayElemAt: ["$feedInfo", 0] },
            replies: { $ifNull: ["$replies", []] },
            isLiked: {
              $cond: [{ $gt: [{ $size: "$likedInfo" }, 0] }, true, false],
            },
          },
        },
        { $sort: { createdAt: -1 } },
        { $skip: Number(data.offset) },
        { $limit: Number(data.limit) },
      ]);

      if (result.length) {
        const count = await feedComment.countDocuments(whereParam.where);
        return { result, count };
      } else {
        return false;
      }
    } catch (err) {
      console.log("DB:error feedCommentService list Failed.", err);
      return false;
    }
  },

  detail: async (uid) => {
    try {
      let where = {
        uid,
        deletedAt: null,
      };
      let userResult = await feedComment.aggregate([
        {
          $match: where,
        },
        {
          $project: {
            id: "$_id",
            _id: 0,
            userId: 1,
            uid: 1,
            title: 1,
            description: 1,
            totalLikes: 1,
            TotalComments: 1,
            TotalShare: 1,
            TotalSaved: 1,
            TotalView: 1,
            status: 1,
            content: 1,
            createdAt: 1,
          },
        },
      ]);

      if (userResult.length > 0) {
        return userResult[0];
      } else {
        return false;
      }
    } catch (err) {
      console.log("DB:error feedCommentService detail Failed.", err);
      return false;
    }
  },

  findLike: async (data) => {
    data.deletedAt = null;
    try {
      let result = await feedCommentLike.findOne(data);
      return result ? result : false;
    } catch (err) {
      console.log(
        "DB:error feedCommentService findLike get query Failed.",
        err
      );
      return false;
    }
  },
  deleteLike: async (where) => {
    try {
      let result = await feedCommentLike.deleteOne(where);
      return result ? result : false;
    } catch (err) {
      console.log("DB:error feedCommentService deleteLike  query Failed.", err);
      return false;
    }
  },
  insertLike: async (data) => {
    data.uid = generateUUID();
    try {
      let insertData = new feedCommentLike(data);
      const result = await insertData.save();
      return result ? result : false;
    } catch (err) {
      console.log("DB:error feedCommentService insertLike query Failed.", err);
      return false;
    }
  },
};

module.exports = feedCommentService;
