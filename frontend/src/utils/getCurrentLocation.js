const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },

      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject("Location permission denied");
            break;

          case error.POSITION_UNAVAILABLE:
            reject("Location unavailable");
            break;

          case error.TIMEOUT:
            reject("Location request timed out");
            break;

          default:
            reject("Unable to fetch location");
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

export default getCurrentLocation;