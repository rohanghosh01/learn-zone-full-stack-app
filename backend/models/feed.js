const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const feedSchema = new Schema(
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

    title: {
      type: String,
      maxLength: 50,
      minLength: 2,
      default: null,
    },
    description: {
      type: String,
      maxLength: 2000,
      minItems: 2,
      default: null,
    },
    totalLikes: {
      type: Number,
      default: 0,
    },
    totalComments: {
      type: Number,
      default: 0,
    },
    totalShare: {
      type: Number,
      default: 0,
    },
    totalSaved: {
      type: Number,
      default: 0,
    },
    totalView: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    commentDisabled: {
      type: Boolean,
      default: false,
    },
    hideLikes: {
      type: Boolean,
      default: false,
    },
    content: [
      {
        type: {
          type: String,
          enum: ["video", "image", "doc"],
          default: "image",
        },
        url: {
          type: String,
          default: null,
        },
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
  },
  {
    versionKey: false, // You should be aware of the outcome after set to false
  }
);

module.exports = mongoose.model("feeds", feedSchema);
