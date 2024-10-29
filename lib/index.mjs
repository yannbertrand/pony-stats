import { env } from 'node:process';
import { getToken } from './get-token.mjs';
import { getTrips } from './get-trips.mjs';
import { updateTripsFile } from './update-trips-file.mjs';

const userID = env.USER_ID;
const token = await getToken(
  userID,
  env.REFRESH_TOKEN,
  env.SECURE_TOKEN_KEY,
  env.LAST_ACCESS_TOKEN
);

const trips = await getTrips(userID, token);
console.log(`${trips.length} trips found`);

const newTrips = await updateTripsFile(trips);
console.log(`${newTrips.length} new trips saved`);
