import { EmergencyHistory } from "../models/emergencyHistory.model.js";
import { fetchNearbyServices } from "../services/overpass.service.js";
import { findNearestService } from "../services/dijkstra.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getNearbyServices = asyncHandler(async (req, res) => {
  const { latitude, longitude, emergencyType, radius } = req.query;

  if (
    latitude === undefined ||
    longitude === undefined ||
    !emergencyType
  ) {
    throw new ApiError(
      400,
      "Latitude, longitude and emergencyType are required"
    );
  }

  const lat = Number(latitude);
  const lng = Number(longitude);

  if (Number.isNaN(lat) || Number.isNaN(lng)) {
    throw new ApiError(400, "Invalid latitude or longitude");
  }

  const services = await fetchNearbyServices(
    lat,
    lng,
    emergencyType,
    Number(radius) || 5000
  );

  const nearestService = findNearestService(
    {
      latitude: lat,
      longitude: lng,
    },
    services
  );

  const sortedServices = services
    .map((service) => {
      const distanceKm =
        findNearestService(
          {
            latitude: lat,
            longitude: lng,
          },
          [service]
        )?.distanceKm || 0;

      return {
        ...service,
        distanceKm,
      };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 10);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        nearestService,
        services: sortedServices,
      },
      "Nearby services fetched successfully"
    )
  );
});

const saveEmergencyHistory = asyncHandler(async (req, res) => {
  const {
    emergencyType,
    customSearchQuery,
    userLocation,
    selectedService,
    routeDetails,
    breakdownType,
    optimizedStops,
  } = req.body;

  if (
    !emergencyType ||
    userLocation?.latitude === undefined ||
    userLocation?.longitude === undefined
  ) {
    throw new ApiError(400, "Emergency type and user location are required");
  }

  const history = await EmergencyHistory.create({
    user: req.user._id,
    emergencyType,
    customSearchQuery,
    userLocation,
    selectedService,
    routeDetails,
    breakdownType,
    optimizedStops,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, history, "Emergency history saved successfully"));
});

const getEmergencyHistory = asyncHandler(async (req, res) => {
  const history = await EmergencyHistory.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(30);

  return res
    .status(200)
    .json(
      new ApiResponse(200, history, "Emergency history fetched successfully")
    );
});

export { getNearbyServices, saveEmergencyHistory, getEmergencyHistory };