const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    uid: {
      type: String, // Use String type for storing Firebase UID
      required: true, // Ensure _id is always provided
      unique: true, // Ensure _id is unique
    },
    countryCode: {
      type: Number,
      maxLength: 4,
      minLength: 1,
      default: null,
    },
    mobileNumber: {
      type: Number,
      maxLength: 15,
      minItems: 8,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      default: null,
    },
    userName: {
      type: String,
      maxLength: 50,
      minLength: 2,
      unique: true,
      sparse: true, //without null except
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
    },
    name: {
      type: String,
      maxLength: 50,
      minLength: 2,
      default: null,
    },
    about: {
      type: String,
      maxLength: 2000,
      minItems: 2,
      default: null,
    },
    dob: {
      type: String,
      default: null,
      // day: {
      //   type: String,
      //   default: null,
      // },
      // month: {
      //   type: String,
      //   default: null,
      // },
      // year: {
      //   type: String,
      //   default: null,
      // },
    },
    address: [
      {
        coordinates: {
          type: { type: String, enum: ["Point"], default: "Point" },
          coordinates: { type: [Number], default: [0, 0], index: "2dsphere" }, // [longitude, latitude]
        },
        street: {
          type: String,
          default: null,
        },
        city: {
          type: String,
          default: null,
        },
        state: {
          type: String,
          default: null,
        },
        country: {
          type: String,
          default: null,
        },
      },
    ],
    totalFollowers: {
      type: Number,
      default: 0,
    },
    totalFollowing: {
      type: Number,
      default: 0,
    },
    totalPosts: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    isPrivate: {
      type: Boolean,
      default: false,
    },
    profileImage: {
      type: String,
      default: null,
    },
    userInterest: {
      type: Array,
      default: null,
    },
    lastReadNotification: {
      type: Date,
      default: null,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    notificationId: {
      type: String,
      default: null,
    },
    socialId: {
      type: String,
      default: null,
    },
    socialType: {
      type: String,
      enum: ["email", "google", "facebook"],
      default: "email",
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    lastSeen: {
      type: Date,
      default: null,
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

module.exports = mongoose.model("users", userSchema);
