const dbConnection = require("../config/db");
const user = require("../models/user");
const mongoose = require("mongoose");
const generateUUID = require("../utilities/uuidGenerate");
const ObjectId = mongoose.Types.ObjectId;

(async () => {
  await dbConnection();
})();

let userAttributes = {
  id: "$uid",
  _id: 0,
  dob: 1,
  email: 1,
  userName: 1,
  countryCode: 1,
  mobileNumber: 1,
  name: 1,
  about: 1,
  address: 1,
  totalFollowers: 1,
  totalFollowing: 1,
  totalPosts: 1,
  totalVibes: 1,
  status: 1,
  isPrivate: 1,
  profileImage: 1,
  userInterest: 1,
  lastReadNotification: 1,
  socialType: 1,
  createdAt: 1,
};

const auth = {
  findOne: async (data) => {
    data.deletedAt = null;
    try {
      let result = await user.findOne(data);
      return result ? result : false;
    } catch (err) {
      console.log("DB:error User findOne get query Failed.", err);
      return false;
    }
  },
  findOneProjection: async (data) => {
    try {
      let result = await user.findOne(data.where).select(data.projection);
      return result ? result : false;
    } catch (err) {
      console.log("DB:error User findOne get query Failed.", err);
      return false;
    }
  },
  getCount: async (data) => {
    try {
      let result = await user.countDocuments(data);
      return result ? result : false;
    } catch (err) {
      console.log("DB:error User getCount get query Failed.", err);
      return false;
    }
  },
  insert: async (data) => {
    data.uid = generateUUID();
    try {
      let insertData = new user(data);
      const result = await insertData.save();
      return result ? result : false;
    } catch (err) {
      console.log("DB:error User insert query Failed.", err);
      return false;
    }
  },
  updateOne: async (where, data) => {
    try {
      let result = await user.updateOne(where, data, {
        runValidators: true,
      });
      return result ? result : false;
    } catch (err) {
      console.log("DB:error User updateOne get query Failed.", err);
      return false;
    }
  },
  findOneWithBlock: async (data) => {
    try {
      let result = await user.aggregate([
        { $match: { _id: new ObjectId(data.toId) } },
        {
          $lookup: {
            from: "blocks",
            localField: "_id",
            foreignField: "fromId",
            as: "block",
            pipeline: [
              {
                $match: { fromId: new ObjectId(data.fromId) },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "blocks",
            localField: "_id",
            foreignField: "toId",
            as: "userBlock",
            pipeline: [
              {
                $match: { fromId: new ObjectId(data.fromId) },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "followers",
            localField: "_id",
            foreignField: "toId",
            as: "userFollowerIng",
            pipeline: [
              {
                $match: { fromId: new ObjectId(data.fromId) },
              },
            ],
          },
        },
        {
          $project: {
            _id: 1,
            uid: 1,
            name: 1,
            userName: 1,
            about: 1,
            totalFollowers: 1,
            totalFollowing: 1,
            totalVibes: 1,
            isPrivate: 1,
            profileImage: 1,
            userRole: 1,
            status: 1,
            block: 1,
            userFollowerIng: 1,
            userBlock: 1,
            mediaPreview: 1,
          },
        },
      ]);
      return result ? result : false;
    } catch (err) {
      console.log("DB:error User findOneWithBlock  query Failed.", err);
      return false;
    }
  },
  unFollowUserList: async (data) => {
    try {
      let param = {
        where: {
          _id: { $ne: new ObjectId(data.userId) },
          deletedAt: null,
          userRole: { $in: ["user"] },
        },
      };
      if (data.search) {
        param.where = {
          _id: { $ne: new ObjectId(data.userId) },
          deletedAt: null,
          userRole: { $in: ["user"] },
          $or: [
            { name: { $regex: data.search, $options: "i" } },
            { userName: { $regex: data.search, $options: "i" } },
          ],
        };
      }

      let result = await user.aggregate([
        {
          $match: param.where,
        },
        {
          $lookup: {
            from: "followers",
            localField: "_id",
            foreignField: "toId",
            as: "isFollow",
            pipeline: [
              {
                $match: { fromId: new ObjectId(data.userId) },
              },
              {
                $project: {
                  fromId: 1,
                  toId: 1,
                  status: 1,
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "block",
            let: { toId: new ObjectId(data.userId) },
            localField: "_id",
            foreignField: "fromId",
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$toId", "$$toId"],
                  },
                },
              },
              {
                $project: {
                  fromId: 1,
                  toId: 1,
                },
              },
            ],
            as: "userBlocksFrom",
          },
        },
        {
          $match: {
            userBlocksFrom: { $size: 0 },
            isFollow: { $size: 0 },
          },
        },
        {
          $project: {
            _id: 1,
            uid: 1,
            name: 1,
            about: 1,
            socialType: 1,
            userInterest: 1,
            totalFollowers: 1,
            totalFollowing: 1,
            totalVibes: 1,
            userName: 1,
            status: 1,
            isPrivate: 1,
            profileImage: 1,
            createdAt: 1,
            //  isFollow: 1,
            // userBlocksFrom: 1,
          },
        },

        // remove those user where userBlocksFrom.length > 0

        {
          $skip: data.offset,
        },
        {
          $limit: data.limit,
        },
      ]);

      return result;
    } catch (error) {
      console.log("DB:error unFollowUserList Failed.", error);
      return false;
    }
  },

  // userList: async (data) => {
  //   let uid = data.uid;
  //   try {
  //     let whereParam = {
  //       where: {
  //         deletedAt: null,
  //       },
  //     };

  //     if (data.status) {
  //       whereParam.where.status = data.status;
  //     }

  //     let userIdsArray = [];
  //     if (data.userIds) {
  //       userIdsArray = data.userIds.split(",");
  //       whereParam.where._id = { $in: userIdsArray };
  //     }

  //     if (data.search) {
  //       searchParam = {
  //         deletedAt: null,
  //         $or: [
  //           { name: { $regex: data.search, $options: "i" } },
  //           { username: { $regex: data.search, $options: "i" } },
  //         ],
  //       };
  //       const searchNumber = Number(data.search);
  //       if (!isNaN(searchNumber)) {
  //         searchParam.$or.push({ mobileNumber: searchNumber });
  //       }
  //       whereParam.where = searchParam;
  //     }

  //     let orderParam = { [data.orderBy]: data.orderType };

  //     let result = await user
  //       .find(whereParam.where, userAttributes)
  //       .sort(orderParam)
  //       .limit(Number(data.limit))
  //       .skip(Number(data.offset));
  //     if (result.length) {
  //       const count = await user.countDocuments(whereParam.where);
  //       return { result, count };
  //     } else {
  //       return false;
  //     }
  //   } catch (err) {
  //     console.log("DB:error userService list Failed.", err);
  //     return false;
  //   }
  // },

  userList: async (data) => {
    let uid = data.uid;
    try {
      let matchConditions = { deletedAt: null };

      if (data.status) {
        matchConditions.status = data.status;
      }

      let userIdsArray = [];
      if (data.userIds) {
        userIdsArray = data.userIds.split(",");
        matchConditions._id = { $in: userIdsArray };
      }

      if (data.search) {
        const searchNumber = Number(data.search);
        matchConditions.$or = [
          { name: { $regex: data.search, $options: "i" } },
          { username: { $regex: data.search, $options: "i" } },
        ];
        if (!isNaN(searchNumber)) {
          matchConditions.$or.push({ mobileNumber: searchNumber });
        }
      }

      let sortConditions = {};
      if (data.orderBy && data.orderType) {
        sortConditions[data.orderBy] = data.orderType === "asc" ? 1 : -1;
      }

      const userAttributes = {
        $project: {
          id: "$uid",
          _id: 0,
          name: 1,
          userName: 1,
          profileImage: 1,
          createdAt: 1,
          isOnline: 1,
          lastSeen: 1,
        },
      };

      let pipeline = [
        {
          $facet: {
            primaryUser: [
              { $match: { uid, ...matchConditions } },
              userAttributes,
            ],
            otherUsers: [
              { $match: { uid: { $ne: uid }, ...matchConditions } },
              userAttributes,
              { $sort: sortConditions },
              { $skip: Number(data.offset) },
              { $limit: Number(data.limit) },
            ],
          },
        },
        {
          $project: {
            result: { $concatArrays: ["$primaryUser", "$otherUsers"] },
            count: {
              $sum: [{ $size: "$primaryUser" }, { $size: "$otherUsers" }],
            },
          },
        },
      ];

      let aggregationResult = await user.aggregate(pipeline);
      let result = aggregationResult[0].result;
      let count = aggregationResult[0].count;

      if (result.length) {
        return { result, count };
      } else {
        return false;
      }
    } catch (err) {
      console.log("DB:error userService list Failed.", err);
      return false;
    }
  },

  userListNew: async (data) => {
    try {
      let whereParam = {
        where: {
          id: { $ne: data.userId },
          deletedAt: null,
        },
      };

      if (data.status) {
        whereParam.where.status = data.status;
      }

      let userIdsArray = [];
      if (data.userIds) {
        userIdsArray = data.userIds.split(",");
        whereParam.where._id = { $in: userIdsArray };
      }

      if (data.search) {
        searchParam = {
          _id: { $ne: data.userId },
          deletedAt: null,
          $or: [
            { name: { $regex: data.search, $options: "i" } },
            { username: { $regex: data.search, $options: "i" } },
          ],
        };
        const searchNumber = Number(data.search);
        if (!isNaN(searchNumber)) {
          searchParam.$or.push({ mobileNumber: searchNumber });
        }
        whereParam.where = searchParam;
      }

      let orderParam = { [data.orderBy]: data.orderType };

      let result = await user.aggregate([
        { $match: whereParam.where },
        {
          $lookup: {
            from: "block",
            localField: "_id",
            foreignField: "toId",
            as: "userBlock",
            pipeline: [
              {
                $match: { fromId: new ObjectId(data.userId) },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "followers",
            localField: "_id",
            foreignField: "toId",
            as: "userFollowerIng",
            pipeline: [
              {
                $match: { fromId: new ObjectId(data.userId) },
              },
            ],
          },
        },
        {
          $project: {
            _id: 1,
            dob: 1,
            uid: 1,
            countryCode: 1,
            mobileNumber: 1,
            password: 1,
            name: 1,
            about: 1,
            address: 1,
            totalFollowers: 1,
            totalFollowing: 1,
            totalVibes: 1,
            status: 1,
            isPrivate: 1,
            profileImage: 1,
            userInterest: 1,
            lastReadNotification: 1,
            createdAt: 1,
            userFollowerIng: 1,
            userBlock: 1,
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $skip: data.offset,
        },
        {
          $limit: data.limit,
        },
      ]);
      if (result.length) {
        return result;
      } else {
        return false;
      }
    } catch (err) {
      console.log("DB:error userService list Failed.", err);
      return false;
    }
  },

  detail: async (uid) => {
    try {
      let where = {
        uid,
        deletedAt: null,
      };
      let userResult = await user.aggregate([
        {
          $match: where,
        },
        {
          $project: userAttributes,
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

  nearUserList: async (data) => {
    try {
      let param = {
        where: {
          _id: { $ne: new ObjectId(data.userId) },
          deletedAt: null,
          userRole: { $in: ["user"] },
        },
      };
      if (data.search) {
        param.where = {
          _id: { $ne: new ObjectId(data.userId) },
          deletedAt: null,
          userRole: { $in: ["user"] },
          $or: [
            { name: { $regex: data.search, $options: "i" } },
            { userName: { $regex: data.search, $options: "i" } },
            { userInterest: { $regex: data.search, $options: "i" } },
          ],
        };
      }

      let result = await user.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [Number(data.lng), Number(data.lat)],
            },
            distanceField: "distance",
            // maxDistance: data.distance * 1.609 * 1000,
            spherical: true,
          },
        },
        {
          $match: param.where,
        },
        {
          $lookup: {
            from: "followers",
            localField: "_id",
            foreignField: "toId",
            as: "isFollow",
            pipeline: [
              {
                $match: { fromId: new ObjectId(data.userId) },
              },
              {
                $project: {
                  fromId: 1,
                  toId: 1,
                  status: 1,
                },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "block",
            let: { toId: new ObjectId(data.userId) },
            localField: "_id",
            foreignField: "fromId",
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$toId", "$$toId"],
                  },
                },
              },
              {
                $project: {
                  fromId: 1,
                  toId: 1,
                },
              },
            ],
            as: "userBlocksFrom",
          },
        },
        {
          $match: {
            userBlocksFrom: { $size: 0 },
          },
        },
        {
          $project: {
            _id: 1,
            uid: 1,
            name: 1,
            about: 1,
            socialType: 1,
            userInterest: 1,
            totalFollowers: 1,
            totalFollowing: 1,
            totalVibes: 1,
            userName: 1,
            status: 1,
            isPrivate: 1,
            profileImage: 1,
            createdAt: 1,
            distance: 1,
            isFollow: {
              $switch: {
                branches: [
                  { case: { $in: ["accepted", "$isFollow.status"] }, then: 1 },
                  { case: { $in: ["pending", "$isFollow.status"] }, then: 2 },
                ],
                default: 0,
              },
            },
          },
        },

        // remove those user where userBlocksFrom.length > 0

        {
          $skip: data.offset,
        },
        {
          $limit: data.limit,
        },
        {
          $sort: {
            distance: 1,
          },
        },
      ]);

      return result;
    } catch (error) {
      console.log("DB:error nearUserList Failed.", error);
      return false;
    }
  },
};

module.exports = auth;
