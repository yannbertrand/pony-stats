export function getBikes(rawTrips) {
  const last6month = new Date();
  last6month.setMonth(last6month.getMonth() - 6);

  const bikes = rawTrips
    .filter((trip) => new Date(trip.endTime) >= last6month)
    .reduce((acc, t) => {
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
