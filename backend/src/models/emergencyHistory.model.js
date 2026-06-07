import mongoose, { Schema } from "mongoose";

const emergencyHistorySchema = new Schema(
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
        "pharmacy",
        "multi_stop",
      ],
      required: true,
    },

    customSearchQuery: {
      type: String,
      trim: true,
      default: "",
    },

    userLocation: {
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
    },

    selectedService: {
      name: {
        type: String,
        trim: true,
      },
      type: {
        type: String,
        trim: true,
      },
      latitude: Number,
      longitude: Number,
      address: String,
    },

    routeDetails: {
      distance: {
        type: Number, // in meters
      },
      eta: {
        type: Number, // in minutes
      },
    },
optimizedStops: {
  type: [
    {
      name: {
        type: String,
      },
      type: {
        type: String,
      },
      latitude: {
        type: Number,
      },
      longitude: {
        type: Number,
      },
      address: {
        type: String,
      },
    },
  ],
  default: [],
},
    breakdownType: {
      type: String,
      enum: [
        "",
        "flat_tyre",
        "engine_issue",
        "battery_dead",
        "out_of_fuel",
        "accident",
      ],
      default: "",
    },
  },
  { timestamps: true }
);

export const EmergencyHistory = mongoose.model(
  "EmergencyHistory",
  emergencyHistorySchema
);