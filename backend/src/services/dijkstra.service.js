const calculateDistance = (pointA, pointB) => {
  const R = 6371; // Earth radius in km

  const dLat = ((pointB.latitude - pointA.latitude) * Math.PI) / 180;
  const dLng = ((pointB.longitude - pointA.longitude) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((pointA.latitude * Math.PI) / 180) *
      Math.cos((pointB.latitude * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;

  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

const findNearestService = (userLocation, services = []) => {
  if (!services.length) {
    return null;
  }

  let nearestService = services[0];
  let shortestDistance = calculateDistance(userLocation, services[0]);

  for (const service of services) {
    const distance = calculateDistance(userLocation, service);

    if (distance < shortestDistance) {
      shortestDistance = distance;
      nearestService = service;
    }
  }

  return {
    ...nearestService,
    distanceKm: Number(shortestDistance.toFixed(2)),
  };
};

const optimizeMultiStopRoute = (startLocation, stops = []) => {
  if (!stops.length) {
    return [];
  }

  let currentLocation = startLocation;
  const remainingStops = [...stops];
  const optimizedRoute = [];

  while (remainingStops.length > 0) {
    let nearestIndex = 0;
    let shortestDistance = calculateDistance(currentLocation, remainingStops[0]);

    for (let i = 1; i < remainingStops.length; i++) {
      const distance = calculateDistance(currentLocation, remainingStops[i]);

      if (distance < shortestDistance) {
        shortestDistance = distance;
        nearestIndex = i;
      }
    }

    const nearestStop = remainingStops.splice(nearestIndex, 1)[0];

    optimizedRoute.push({
      ...nearestStop,
      distanceFromPreviousKm: Number(shortestDistance.toFixed(2)),
    });

    currentLocation = nearestStop;
  }

  return optimizedRoute;
};

export {
  calculateDistance,
  findNearestService,
  optimizeMultiStopRoute,
};