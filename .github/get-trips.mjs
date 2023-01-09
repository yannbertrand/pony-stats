import { setFailed, setOutput, getInput } from '@actions/core';
import { getTrips } from '../lib/get-trips.mjs';

try {
  const trips = await getTrips(process.env.USER_ID, process.env.ACCESS_TOKEN);

  console.log(`Got ${trips.length} trips`);

  setOutput('trips', JSON.stringify(trips));
} catch (error) {
  setFailed(`Could not get trips ${error}`);
}
