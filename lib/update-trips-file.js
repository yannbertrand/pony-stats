import { writeFile } from 'fs';
import trips from '../trips.json' with { type: 'json' };

export const updateTripsFile = async (newTrips) => {
  const firstDuplicateIndex = newTrips.findIndex(
    (trip) => trip.trip_id === trips[0].trip_id
  );
  if (firstDuplicateIndex > -1) {
    newTrips.splice(firstDuplicateIndex, newTrips.length);
  }

  const allTrips = [...newTrips, ...trips];

  await writeFile(
    `trips.json`,
    JSON.stringify(allTrips),
    'utf8',
    console.error
  );

  return newTrips;
};
