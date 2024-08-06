const dbConnection = require("../config/db");
const chat = require("../models/chat");

(async () => {
  await dbConnection();
})();

let userAttributes = {
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

const auth = {
  findOne: async (uid, userId) => {
    try {
      let result = await chat.findOne({
        deletedAt: null,

        $or: [
          {
            $and: [
              {
                userId: uid,
              },
              {
                receiverId: userId,
              },
            ],
          },
          {
            $and: [
              {
                userId: userId,
              },
              {
                receiverId: uid,
              },
            ],
          },
        ],
      });
      return result ? result : false;
    } catch (err) {
      console.log("DB:error User findOne get query Failed.", err);
      return false;
    }
  },

  insert: async (data) => {
    try {
      let insertData = new chat(data);
      const result = await insertData.save();
      return result ? result : false;
    } catch (err) {
      console.log("DB:error chat insert query Failed.", err);
      return false;
    }
  },

  chatList: async (data) => {
    try {
      let whereParam = {
        where: {
          deletedAt: null,
          connectionId: data.connectionId,
        },
      };

      let result = await chat.aggregate([
        { $match: whereParam.where },
        {
          $lookup: {
            from: "users",
            localField: "receiverId",
            foreignField: "uid",
            as: "userInfo",
            pipeline: [userAttributes],
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "uid",
            as: "fromUserInfo",
            pipeline: [userAttributes],
          },
        },
        {
          $unwind: {
            path: "$messages",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "messages.senderId",
            foreignField: "uid",
            as: "messages.senderInfo",
            pipeline: [userAttributes],
          },
        },
        {
          $addFields: {
            "messages.senderInfo": {
              $arrayElemAt: ["$messages.senderInfo", 0],
            },
          },
        },
        {
          $addFields: {
            isAdmin: {
              $cond: {
                if: {
                  $and: [
                    { $eq: ["$userId", data.userId] },
                    { $eq: ["$isGroup", true] },
                  ],
                },
                then: 1,
                else: 0,
              },
            },
          },
        },
        {
          $unwind: {
            path: "$members",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "members",
            foreignField: "uid",
            as: "memberInfo",
            // pipeline: [userAttributes],
          },
        },
        {
          $addFields: {
            memberInfo: { $arrayElemAt: ["$memberInfo", 0] },
          },
        },
        {
          $addFields: {
            "members.isAdmin": {
              $cond: {
                if: { $eq: ["$memberInfo.uid", "$userId"] },
                then: "$isAdmin",
                else: 0,
              },
            },
          },
        },
        {
          $group: {
            _id: "$_id",
            id: { $first: "$uid" },
            userId: { $first: "$userId" },
            receiverId: { $first: "$receiverId" },
            connectionId: { $first: "$connectionId" },
            lastMessage: { $first: "$lastMessage" },
            createdAt: { $first: "$createdAt" },
            userInfo: { $first: "$userInfo" },
            fromUserInfo: { $first: "$fromUserInfo" },
            members: {
              $addToSet: {
                id: "$memberInfo.uid",
                name: "$memberInfo.name",
                userName: "$memberInfo.userName",
                profileImage: "$memberInfo.profileImage",
                createdAt: "$memberInfo.createdAt",
                isOnline: "$memberInfo.isOnline",
                lastSeen: "$memberInfo.isOnline",
                isAdmin: "$members.isAdmin",
              },
            },
            isGroup: { $first: "$isGroup" },
            groupName: { $first: "$groupName" },
            groupImage: { $first: "$groupImage" },
            isAdmin: { $first: "$isAdmin" },
            messages: {
              $addToSet: {
                $cond: {
                  if: {
                    $and: [{ $ne: ["$messages", {}] }],
                  },
                  then: "$messages",
                  else: null,
                },
              },
            },
          },
        },
        {
          $project: {
            id: "$uid",
            _id: 0,
            userId: 1,
            receiverId: 1,
            connectionId: 1,
            lastMessage: 1,
            members: 1,
            isGroup: 1,
            groupName: 1,
            groupImage: 1,
            isAdmin: 1,
            messages: {
              $filter: {
                input: "$messages",
                as: "message",
                cond: {
                  $and: [
                    { $ne: ["$$message", null] },
                    {
                      $not: {
                        $in: [data.userId, "$$message.clearChat"],
                      },
                    },
                  ],
                },
              },
            },
            createdAt: 1,
            userInfo: { $arrayElemAt: ["$userInfo", 0] },
            fromUserInfo: { $arrayElemAt: ["$fromUserInfo", 0] },
          },
        },
        {
          $addFields: {
            messages: {
              $reverseArray: {
                $sortArray: { input: "$messages", sortBy: { timestamp: -1 } },
              },
            },
          },
        },

        { $sort: { createdAt: -1 } },
        { $skip: Number(data.offset) },
        { $limit: Number(data.limit) },
      ]);

      console.log(">>result", result);
      if (result.length) {
        const count = await chat.countDocuments(whereParam.where);
        return { result, count };
      } else {
        return false;
      }
    } catch (err) {
      console.log("DB:error chatList list Failed.", err);
      return false;
    }
  },

  messageList: async (data) => {
    try {
      const { userId, offset, limit, tab } = data;

      // Build the match condition
      let matchCondition = {
        deletedAt: null,
        $or: [{ receiverId: userId }, { userId: userId }, { members: userId }],
        ...(tab == "groups"
          ? { isGroup: true }
          : tab == "chats"
          ? { isGroup: false }
          : {}),
      };

      // Create the aggregation pipeline
      let pipeline = [
        { $match: matchCondition },
        {
          $lookup: {
            from: "users",
            localField: "receiverId",
            foreignField: "uid",
            as: "userInfo",
            pipeline: [userAttributes],
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "uid",
            as: "fromUserInfo",
            pipeline: [userAttributes],
          },
        },
        {
          $addFields: {
            isPrimaryUser: {
              $cond: {
                if: {
                  $and: [
                    { $eq: ["$userId", userId] },
                    { $eq: ["$receiverId", userId] },
                  ],
                },
                then: 1,
                else: 0,
              },
            },
          },
        },
        {
          $addFields: {
            isAdmin: {
              $cond: {
                if: {
                  $and: [
                    { $eq: ["$userId", userId] },
                    { $eq: ["$isGroup", true] },
                  ],
                },
                then: 1,
                else: 0,
              },
            },
          },
        },
        {
          $unwind: {
            path: "$members",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "members",
            foreignField: "uid",
            as: "memberInfo",
            pipeline: [userAttributes],
          },
        },
        {
          $addFields: {
            memberInfo: { $arrayElemAt: ["$memberInfo", 0] },
          },
        },
        {
          $group: {
            _id: "$_id",
            id: { $first: "$uid" },
            userId: { $first: "$userId" },
            connectionId: { $first: "$connectionId" },
            receiverId: { $first: "$receiverId" },
            lastMessage: { $first: "$lastMessage" },
            createdAt: { $first: "$createdAt" },
            userInfo: { $first: "$userInfo" },
            fromUserInfo: { $first: "$fromUserInfo" },
            isPrimaryUser: { $first: "$isPrimaryUser" },
            isAdmin: { $first: "$isAdmin" },
            isGroup: { $first: "$isGroup" },
            groupName: { $first: "$groupName" },
            groupImage: { $first: "$groupImage" },
            members: {
              $push: {
                id: "$memberInfo.uid",
                name: "$memberInfo.name",
                userName: "$memberInfo.userName",
                profileImage: "$memberInfo.profileImage",
                createdAt: "$memberInfo.createdAt",
                isOnline: "$memberInfo.isOnline",
                lastSeen: "$memberInfo.isOnline",
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            id: 1,
            userId: 1,
            connectionId: 1,
            receiverId: 1,
            lastMessage: 1,
            createdAt: 1,
            userInfo: { $arrayElemAt: ["$userInfo", 0] },
            fromUserInfo: { $arrayElemAt: ["$fromUserInfo", 0] },
            isPrimaryUser: 1,
            isAdmin: 1,
            isGroup: 1,
            groupName: 1,
            groupImage: 1,
            members: {
              $filter: {
                input: "$members",
                as: "member",
                cond: { $ne: ["$$member.id", null] },
              },
            },
          },
        },
        {
          $sort: {
            isPrimaryUser: -1, // First sort by whether the message is from the primary user
            createdAt: -1, // Then sort by creation date
          },
        },
        { $skip: Number(offset) },
        { $limit: Number(limit) },
      ];

      let result = await chat.aggregate(pipeline);

      if (result.length) {
        const count = await chat.countDocuments(matchCondition);
        return { result, count };
      } else {
        return false;
      }
    } catch (err) {
      console.log("DB:error chatList list Failed.", err);
      return false;
    }
  },

  update: async (id, data) => {
    try {
      let result = await chat.updateOne(
        { connectionId: id },
        {
          $push: { messages: data },
          lastMessage: { message: data.message, timestamp: new Date() },
        }
      );
      return result ? result : false;
    } catch (err) {
      console.log("DB:error chat insert query Failed.", err);
      return false;
    }
  },
  updateGroup: async (where, data) => {
    try {
      let result = await chat.updateOne(where, data);
      return result ? result : false;
    } catch (err) {
      console.log("DB:error chat updateGroup query Failed.", err);
      return false;
    }
  },

  removeMember: async (where, data) => {
    try {
      let result = await chat.updateOne(where, data);
      console.log(">>", result);
      return result ? result : false;
    } catch (err) {
      console.log("DB:error chat updateGroup query Failed.", err);
      return false;
    }
  },
  deleteGroup: async (where) => {
    try {
      let result = await chat.deleteOne(where);
      console.log(">>", result);
      return result ? result : false;
    } catch (err) {
      console.log("DB:error chat deleteGroup query Failed.", err);
      return false;
    }
  },
  findGroup: async (connectionId, userId) => {
    try {
      let result = await chat.findOne({
        deletedAt: null,
        connectionId,
        userId,
      });
      return result ? result : false;
    } catch (err) {
      console.log("DB:error User findOne get query Failed.", err);
      return false;
    }
  },
};

module.exports = auth;
