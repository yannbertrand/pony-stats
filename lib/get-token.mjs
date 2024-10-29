export const getToken = async (userID, refreshToken, key, lastAccessToken) => {
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
      throw new Error(
        `${newAccessTokenResult.status} ${newAccessTokenResult.statusText}`
      );
    }

    const newAccessTokenResultObj = await newAccessTokenResult.json();
    if (newAccessTokenResultObj['access_token'] == null) {
      throw new Error(
        `New access token not given by server, ${newAccessTokenResultObj.status} ${newAccessTokenResultObj.statusText}`
      );
    }

    if (newAccessTokenResultObj['expires_in'] != '3600') {
      console.log(
        `'expires_in' value is not 3600 but ${newAccessTokenResultObj.expires_in}`
      );
    }
    if (newAccessTokenResultObj['token_type'] != 'Bearer') {
      console.log(
        `'token_type' value is not Bearer but ${newAccessTokenResultObj.token_type}`
      );
    }
    if (newAccessTokenResultObj['refresh_token'] != refreshToken) {
      console.log(`'refresh_token' value has changed`);
      console.log(
        'Got new refresh token',
        newAccessTokenResultObj.refresh_token
      );
    }
    if (newAccessTokenResultObj['id_token'] == null) {
      console.log(`'id_token' value is ${newAccessTokenResultObj.id_token}`);
    }
    if (newAccessTokenResultObj['user_id'] == null) {
      console.log(`'user_id' value has changed`);
    }

    validAccessToken = newAccessTokenResultObj['access_token'];
    console.log('Got new access token', validAccessToken);
  }

  return validAccessToken;
};
