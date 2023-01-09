import { getToken } from './get-token.mjs';
import { getTrips } from './get-trips.mjs';

import * as dotenv from 'dotenv';
dotenv.config();

const userID = process.env.USER_ID;
const token = await getToken(
  userID,
  process.env.PROJECT_ID,
  process.env.REFRESH_TOKEN,
  process.env.SECURE_TOKEN_KEY,
  process.env.LAST_ACCESS_TOKEN
);

const trips = await getTrips(userID, token);
console.log(trips.length, 'trips found');
