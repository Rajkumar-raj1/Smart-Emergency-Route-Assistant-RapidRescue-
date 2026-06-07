import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const emergencyContactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    relation: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: true }
);

const vehicleSchema = new Schema(
  {
    vehicleType: {
      type: String,
      enum: ["car", "bike", "scooter", "other"],
      default: "other",
    },
    vehicleNumber: {
      type: String,
      trim: true,
      uppercase: true,
    },
    model: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
  address: {
  type: String,
  trim: true,
},

lastKnownLocation: {
  latitude: {
    type: Number,
    default: null,
  },
  longitude: {
    type: Number,
    default: null,
  },
  address: {
    type: String,
    trim: true,
  },
  updatedAt: {
    type: Date,
  },
},

    emergencyContacts: [emergencyContactSchema],

    vehicleDetails: {
      type: vehicleSchema,
      default: {},
    },

    refreshToken: {
      type: String,
      select: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d",
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "10d",
    }
  );
};

export const User = mongoose.model("User", userSchema);