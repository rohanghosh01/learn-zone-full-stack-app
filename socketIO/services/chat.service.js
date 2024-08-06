const dbConnection = require("../config/db");
const chat = require("../models/chat");

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
    isOnline: 1,
    lastSeen: 1,
  },
};

const auth = {
  findOne: async (data) => {
    data.deletedAt = null;
    try {
      let result = await chat.findOne(data);
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
          $project: {
            id: "$uid",
            _id: 0,
            userId: 1,
            receiverId: 1,
            connectionId: 1,
            lastMessage: 1,
            messages: 1,
            createdAt: 1,
            userInfo: { $arrayElemAt: ["$userInfo", 0] },
            fromUserInfo: { $arrayElemAt: ["$fromUserInfo", 0] },
          },
        },
        { $sort: { createdAt: -1 } },
        { $skip: Number(data.offset) },
        { $limit: Number(data.limit) },
      ]);

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
      let whereParam = {
        where: {
          deletedAt: null,
          $or: [{ receiverId: data.userId }, { userId: data.userId }],
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
          $project: {
            id: "$uid",
            _id: 0,
            userId: 1,
            connectionId: 1,
            lastMessage: 1,
            // messages: 1,
            createdAt: 1,
            userInfo: { $arrayElemAt: ["$userInfo", 0] },
            fromUserInfo: { $arrayElemAt: ["$fromUserInfo", 0] },
          },
        },
        { $sort: { createdAt: -1 } },
        { $skip: Number(data.offset) },
        { $limit: Number(data.limit) },
      ]);

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
  updateMessage: async (where, data) => {
    let { id, roomId } = where;
    try {
      let result = await chat.updateOne(
        { connectionId: roomId, "messages.uid": id },
        { $set: { "messages.$": data } }
      );
      return result ? result : false;
    } catch (err) {
      console.log("DB:error chat updateMessage query Failed.", err);
      return false;
    }
  },
  getMessage: async (where) => {
    let { id, roomId } = where;
    try {
      let result = await chat.findOne(
        { connectionId: roomId, "messages.uid": id },
        { "messages.$": 1 }
      );
      return result ? result.messages[0] : false;
    } catch (err) {
      console.log("DB:error chat getMessage query failed.", err);
      return false;
    }
  },
  clearMessage: async (where) => {
    console.log(">>where", where);
    let { roomId, userId } = where;
    try {
      let result = await chat.updateMany(
        {
          connectionId: roomId,
          $or: [
            { "messages.senderId": userId },
            { "messages.receiverId": userId },
          ],
        },
        {
          $push: { "messages.$[].clearChat": userId },
          "lastMessage.message": null,
        }
      );

      return result.modifiedCount > 0;
    } catch (err) {
      console.log("DB:error chat updateMessage query Failed.", err);
      return false;
    }
  },
};

module.exports = auth;
