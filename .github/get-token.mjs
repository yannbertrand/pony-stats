import { getInput, setFailed, setOutput } from '@actions/core';
import { getToken } from '../lib/get-token.mjs';

try {
  const accessToken = await getToken(
    process.env.USER_ID,
    process.env.REFRESH_TOKEN,
    process.env.SECURE_TOKEN_KEY,
    getInput('lastAccessToken') ?? process.env.LAST_ACCESS_TOKEN
  );

  setOutput('accessToken', accessToken);
} catch (error) {
  setFailed(`Could not get token ${error}`);
}
