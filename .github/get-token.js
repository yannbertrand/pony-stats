import { env } from 'node:process';
import { getInput, setFailed, setOutput } from '@actions/core';
import { getToken } from '../lib/get-token.js';

try {
	const accessToken = await getToken(
		env.USER_ID,
		env.REFRESH_TOKEN,
		env.SECURE_TOKEN_KEY,
		getInput('lastAccessToken') ?? env.LAST_ACCESS_TOKEN,
	);

	setOutput('accessToken', accessToken);
} catch (error) {
	setFailed(`Could not get token ${error}`);
}
