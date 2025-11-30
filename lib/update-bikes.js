import { env } from 'node:process';
import { getBikes } from './get-bikes.js';
import { getToken } from './get-token.js';
import { updateBikesFile } from './update-bikes-file.js';

const userID = env.USER_ID;
const token = await getToken(
	userID,
	env.REFRESH_TOKEN,
	env.SECURE_TOKEN_KEY,
	env.LAST_ACCESS_TOKEN,
);

const bikes = await getBikes(userID, token);
console.log(`${bikes.length} bikes found`);

const newBikes = await updateBikesFile(bikes);
console.log(`${newBikes.length} bikes saved`);
