// backend/models/Chat.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema({
  connectionId: { type: String, required: true },
  userId: { type: String, required: true },
  receiverId: { type: String, required: true },
  isGroup: { type: Boolean, default: false },
  groupName: { type: String },
  groupImage: { type: String },
  members: [],
  lastMessage: {
    message: { type: String },
    timestamp: { type: Date, default: Date.now },
  },
  messages: [
    {
      uid: { type: String, required: true },
      senderId: { type: String, required: true },
      receiverId: { type: String, required: true },
      message: { type: String, required: true },
      file: {
        type: { type: String, default: null },
        url: { type: String, default: null },
        name: { type: String, default: null },
        size: { type: String, default: null },
      },
      timestamp: { type: Date, default: Date.now },
      isEdited: { type: Boolean, default: false },
      deletedAt: { type: Date, default: null },
      repliedBySender: {
        message: { type: String, required: true },
        time: { type: Date, required: true },
        name: { type: String, required: true },
        userId: { type: String, required: true },
        file: {
          type: { type: String, default: null },
          url: { type: String, default: null },
          name: { type: String, default: null },
          size: { type: String, default: null },
        },
      },
      repliedByReceiver: {
        message: { type: String, required: true },
        time: { type: Date, required: true },
        name: { type: String, required: true },
        userId: { type: String, required: true },
        file: {
          type: { type: String, default: null },
          url: { type: String, default: null },
          name: { type: String, default: null },
          size: { type: String, default: null },
        },
      },
      repliedByMember: [
        {
          message: { type: String, required: true },
          time: { type: Date, required: true },
          name: { type: String, required: true },
          userId: { type: String, required: true },
          file: {
            type: { type: String, default: null },
            url: { type: String, default: null },
            name: { type: String, default: null },
            size: { type: String, default: null },
          },
        },
      ],

      clearChat: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
  deletedAt: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model("chats", chatSchema);
