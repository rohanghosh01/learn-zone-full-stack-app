const dbConnection = require("../config/db");
const feedLike = require("../models/feedLike");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const generateUUID = require("../utilities/uuidGenerate");
(async () => {
  await dbConnection();
})();

const feedLikeService = {
  findOne: async (data) => {
    data.deletedAt = null;
    try {
      let result = await feedLike.findOne(data);
      return result ? result : false;
    } catch (err) {
      console.log("DB:error feedLikeService findOne get query Failed.", err);
      return false;
    }
  },

  insert: async (data) => {
    data.uid = generateUUID();
    try {
      let insertData = new feedLike(data);
      const result = await insertData.save();
      return result ? result : false;
    } catch (err) {
      console.log("DB:error feedLikeService insert query Failed.", err);
      return false;
    }
  },
  updateOne: async (where, data) => {
    try {
      let result = await feedLike.updateOne(where, data, {
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
      let result = await feedLike.deleteOne(where);
      return result ? result : false;
    } catch (err) {
      console.log("DB:error feedLikeService delete  query Failed.", err);
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

      let orderParam = { [data.orderBy]: data.orderType };

      let result = await feedLike
        .find(whereParam.where, {
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
        })
        .sort(orderParam)
        .limit(Number(data.limit))
        .skip(Number(data.offset));
      console.log(">>>>>>>>>>>>>>>>>>>log", result);
      if (result.length) {
        const count = await feedLike.countDocuments(whereParam.where);
        return { result, count };
      } else {
        return false;
      }
    } catch (err) {
      console.log("DB:error feedLikeService list Failed.", err);
      return false;
    }
  },

  detail: async (uid) => {
    try {
      let where = {
        uid,
        deletedAt: null,
      };
      let userResult = await feedLike.aggregate([
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
      console.log("DB:error feedLikeService detail Failed.", err);
      return false;
    }
  },
};

module.exports = feedLikeService;
