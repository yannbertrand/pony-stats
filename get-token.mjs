import { getInput, setOutput } from '@actions/core';

export const getToken = async (
  userID,
  projectID,
  refreshToken,
  key,
  lastAccessToken
) => {
  let validAccessToken;

  const validateTokenResult = await fetch(
    'https://api.getapony.com/log?ua=true',
    {
      method: 'POST',
      headers: {
        accept: '*/*',
        'content-type': 'application/x-www-form-urlencoded',
        'accept-language': 'en-GB,en;q=0.9',
        'accept-encoding': 'gzip, deflate, br',
        'user-agent': 'PonyBikes/80 CFNetwork/1399.4 Darwin/22.1.0',
        'pony-seqno': 1,
        authorization: `Bearer ${lastAccessToken}`,
      },
      body: JSON.stringify({
        event_type: 'app_auth_user',
        userID,
      }),
    }
  );

  if (validateTokenResult.ok) {
    console.log('Previous access token is valid');
    validAccessToken = lastAccessToken;
  } else {
    console.log('Previous access token is invalid, getting new one');
    const newAccessTokenResult = await fetch(
      `https://securetoken.googleapis.com/v1/token?key=${key}`,
      {
        method: 'POST',
        headers: {
          'x-client-version': 'iOS/FirebaseSDK/9.4.0/FirebaseCore-iOS',
          'content-type': 'application/json',
          accept: '*/*',
          'x-ios-bundle-identifier': 'co.ponybikes.venus',
          'x-firebase-gmpid': '1:648785325319:ios:7e1989f2f28d1286',
          'user-agent':
            'FirebaseAuth.iOS/9.4.0 co.ponybikes.venus/5.13.1 iPad/16.1 hw/iPad8_6',
          'accept-language': 'en',
          'accept-encoding': 'gzip, deflate, br',
        },
        body: JSON.stringify({
          grantType: 'refresh_token',
          refreshToken,
        }),
      }
    );

    if (!newAccessTokenResult.ok) {
      setFailed('Could not get new access token because of network error');

      throw new Error('Could not get new access token', {
        cause: newAccessTokenResult,
      });
    }

    const newAccessTokenResultObj = await newAccessTokenResult.json();
    if (newAccessTokenResultObj['access_token'] == null) {
      setFailed('Could not get new access token because of server error');

      throw new Error('Could not get new access token', {
        cause: newAccessTokenResultObj.status,
      });
    }
    if (
      typeof newAccessTokenResultObj['expires_in'] != 'number' ||
      newAccessTokenResultObj['token_type'] != 'Bearer' ||
      newAccessTokenResultObj['token_type'] != refreshToken ||
      newAccessTokenResultObj['id_token'] == null ||
      newAccessTokenResultObj['user_id'] != userID ||
      newAccessTokenResultObj['project_id'] != projectID
    ) {
      console.log('Something strange happened', { newAccessTokenResultObj });
    }

    validAccessToken = newAccessTokenResultObj['access_token'];
    console.log('Got new access token', validAccessToken);
  }

  return validAccessToken;
};

if (!import.meta.url) {
  const accessToken = await getToken(
    process.env.USER_ID,
    process.env.PROJECT_ID,
    process.env.REFRESH_TOKEN,
    process.env.SECURE_TOKEN_KEY,
    getInput('lastAccessToken') ?? process.env.LAST_ACCESS_TOKEN
  );

  setOutput('accessToken', accessToken);
}
