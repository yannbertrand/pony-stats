import { updateTripsFile } from '../lib/update-trips-file.mjs';

const newTrips = JSON.parse(process.argv.at(2));

const realNewTrips = await updateTripsFile(newTrips);

if (realNewTrips.length >= 2) {
  const firstNewTripDate = new Date(realNewTrips.at(-1).startTime);
  const lastNewTripDate = new Date(realNewTrips.at(0).startTime);
  console.log(
    `${
      newTrips.length
    } new trips saved from ${firstNewTripDate.toLocaleString()} to ${lastNewTripDate.toLocaleString()}`
  );
} else if (realNewTrips.length === 1) {
  const newTripDate = new Date(realNewTrips.at(0).startTime);
  console.log(
    `${newTrips.length} new trip saved from ${newTripDate.toLocaleString()}`
  );
} else {
  console.log(`No new trips saved`);
}
