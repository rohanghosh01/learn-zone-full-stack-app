const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const feedCommentSchema = new Schema(
  {
    uid: {
      type: String, // Use String type for storing Firebase UID
      required: true, // Ensure _id is always provided
      unique: true, // Ensure _id is unique
    },
    comment: {
      type: String,
      maxLength: 2000,
      minItems: 2,
      default: null,
    },
    userId: {
      type: String,
      required: true,
    },

    feedId: {
      type: String,
      required: true,
    },
    parentId: {
      type: String,
      default: null,
    },
    totalLikes: {
      type: Number,
      default: 0,
    },
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
  },
  {
    versionKey: false, // You should be aware of the outcome after set to false
  }
);

module.exports = mongoose.model("feed_comments", feedCommentSchema);
