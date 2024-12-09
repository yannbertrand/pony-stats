import { env } from 'node:process';
import { setFailed, setOutput } from '@actions/core';
import { getTrips } from '../lib/get-trips.js';

try {
	const trips = await getTrips(env.USER_ID, env.ACCESS_TOKEN);

	console.log(`Got ${trips.length} trips`);

	setOutput('trips', JSON.stringify(trips));
} catch (error) {
	setFailed(`Could not get trips ${error}`);
}
