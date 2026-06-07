import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh tokens"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    phone,
    password,
    address,
    vehicleDetails,
    emergencyContacts,
  } = req.body;

  if (
    [fullName, email, phone, password].some(
      (field) => !field || field.trim() === ""
    )
  ) {
    throw new ApiError(400, "All required fields are mandatory");
  }

  const existedUser = await User.findOne({
    $or: [{ email }, { phone }],
  });

  if (existedUser) {
    throw new ApiError(409, "User already exists");
  }

  const user = await User.create({
    fullName,
    email,
    phone,
    password,
    address,
    vehicleDetails,
    emergencyContacts,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "User registration failed");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email }).select("+password +refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } =
    await generateAccessAndRefreshTokens(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

const updateLastKnownLocation = asyncHandler(async (req, res) => {
  const { latitude, longitude, address } = req.body;

 if (latitude === undefined || longitude === undefined) {
  throw new ApiError(400, "Latitude and longitude are required");
}

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        lastKnownLocation: {
          latitude,
          longitude,
          address,
          updatedAt: new Date(),
        },
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "Location updated successfully")
    );
});
const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, phone, address, vehicleDetails } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        fullName,
        phone,
        address,
        vehicleDetails,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Profile updated successfully"));
});

const addEmergencyContact = asyncHandler(async (req, res) => {
  const { name, relation, phone } = req.body;

  if (!name || !phone) {
    throw new ApiError(400, "Contact name and phone are required");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $push: {
        emergencyContacts: {
          name,
          relation,
          phone,
        },
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(201)
    .json(new ApiResponse(201, updatedUser, "Emergency contact added"));
});

const deleteEmergencyContact = asyncHandler(async (req, res) => {
  const { contactId } = req.params;

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: {
        emergencyContacts: {
          _id: contactId,
        },
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Emergency contact deleted"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateLastKnownLocation,
  updateProfile,
  addEmergencyContact,
  deleteEmergencyContact,
};