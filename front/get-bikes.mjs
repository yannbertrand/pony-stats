export function getBikes(rawTrips) {
  const bikes = rawTrips.reduce((acc, t) => {
    if (!acc[t.bikeName]) {
      acc[t.bikeName] = {
        bikeName: t.bikeName,
        firstTripDay: new Date(t.endTime),
      };
    }
    return acc;
  }, {});

  return bikes;
}
