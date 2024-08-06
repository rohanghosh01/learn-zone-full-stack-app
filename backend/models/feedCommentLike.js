const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const feedCommentLikeSchema = new Schema(
  {
    uid: {
      type: String, // Use String type for storing Firebase UID
      required: true, // Ensure _id is always provided
      unique: true, // Ensure _id is unique
    },
    userId: {
      type: String,
      required: true,
    },

    feedId: {
      type: String,
      required: true,
    },
    commentId: {
      type: String,
      required: true,
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

module.exports = mongoose.model("feed_comment_likes", feedCommentLikeSchema);
