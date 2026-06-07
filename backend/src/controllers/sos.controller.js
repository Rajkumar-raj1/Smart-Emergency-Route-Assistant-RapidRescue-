import { User } from "../models/user.model.js";
import { SOSLog } from "../models/sosLog.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const sendSOS = asyncHandler(async (req, res) => {
  const { emergencyType, message, location } = req.body;

  if (
    !emergencyType ||
    !message ||
    location?.latitude === undefined ||
    location?.longitude === undefined
  ) {
    throw new ApiError(400, "Emergency type, message and location are required");
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const googleMapsLink = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;

  const sosMessage = `${message}\n\nMy current location: ${googleMapsLink}`;

  const sosLog = await SOSLog.create({
    user: req.user._id,
    emergencyType,
    message: sosMessage,
    location: {
      latitude: location.latitude,
      longitude: location.longitude,
      address: location.address || "",
      googleMapsLink,
    },
    sentToContacts: user.emergencyContacts.map((contact) => ({
      name: contact.name,
      phone: contact.phone,
    })),
    status: "sent",
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        sosLog,
        sosMessage,
        googleMapsLink,
      },
      "SOS generated successfully"
    )
  );
});

const getSOSLogs = asyncHandler(async (req, res) => {
  const logs = await SOSLog.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(30);

  return res
    .status(200)
    .json(new ApiResponse(200, logs, "SOS logs fetched successfully"));
});

export { sendSOS, getSOSLogs };