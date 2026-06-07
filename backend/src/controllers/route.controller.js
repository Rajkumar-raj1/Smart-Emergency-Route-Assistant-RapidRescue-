import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  getRouteFromOSRM,
  getMultiStopRouteFromOSRM,
} from "../services/osrm.service.js";
import { optimizeMultiStopRoute } from "../services/dijkstra.service.js";

const getShortestRoute = asyncHandler(async (req, res) => {
  const { startLat, startLng, destinationLat, destinationLng } = req.query;

  if (
    startLat === undefined ||
    startLng === undefined ||
    destinationLat === undefined ||
    destinationLng === undefined
  ) {
    throw new ApiError(400, "All coordinates are required");
  }

  const route = await getRouteFromOSRM(
    {
      latitude: Number(startLat),
      longitude: Number(startLng),
    },
    {
      latitude: Number(destinationLat),
      longitude: Number(destinationLng),
    }
  );

  if (!route) {
    throw new ApiError(404, "No route found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, route, "Shortest route fetched successfully")
    );
});

const optimizeRouteWithMultipleStops = asyncHandler(async (req, res) => {
  const { startLat, startLng, stops } = req.body;

  if (
    startLat === undefined ||
    startLng === undefined ||
    !Array.isArray(stops)
  ) {
    throw new ApiError(400, "Start location and stops are required");
  }

  if (stops.length === 0) {
    throw new ApiError(400, "Stops cannot be empty");
  }

  const optimizedStops = optimizeMultiStopRoute(
    {
      latitude: Number(startLat),
      longitude: Number(startLng),
    },
    stops
  );

  const fullRoute = await getMultiStopRouteFromOSRM([
    {
      latitude: Number(startLat),
      longitude: Number(startLng),
    },
    ...optimizedStops,
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        optimizedStops,
        fullRoute,
      },
      "Multi-stop route optimized successfully"
    )
  );
});

export {
  getShortestRoute,
  optimizeRouteWithMultipleStops,
};