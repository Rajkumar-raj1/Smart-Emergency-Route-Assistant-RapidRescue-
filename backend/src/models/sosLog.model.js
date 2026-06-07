import mongoose, { Schema } from "mongoose";

const sosLogSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    emergencyType: {
      type: String,
      enum: [
        "medical",
        "police",
        "car_breakdown",
        "fuel",
        "fire",
        "custom",
      ],
      required: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
      address: {
        type: String,
        trim: true,
      },
      googleMapsLink: {
        type: String,
        trim: true,
      },
    },

    sentToContacts: [
      {
        name: {
          type: String,
          trim: true,
        },
        phone: {
          type: String,
          trim: true,
        },
      },
    ],

    status: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export const SOSLog = mongoose.model("SOSLog", sosLogSchema);