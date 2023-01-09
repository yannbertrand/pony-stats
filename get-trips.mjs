import { setFailed } from '@actions/core';

export const getTrips = async (userID, accessToken) => {
  const getTripsResult = await fetch(
    `https://angel.getapony.com/v0/trips/angels/${userID}`,
    {
      headers: {
        authorization: `Bearer ${accessToken}`,
        'content-type': 'application/json',
        'pony-seqno': 3,
        'app-version': '5.13.1',
        accept: '*/*',
        'build-number': 80,
        'device-id': '2B141814-4F53-5C93-A520-CF1733242BFC',
        'app-name': 'pony',
        'accept-encoding': 'br;q=1.0, gzip;q=0.9, deflate;q=0.8',
        'pony-session': '-NLN3jaN1O1HGeDkEYHx',
        platform: 'iOS',
        'accept-language': 'en-FR;q=1.0, fr-FR;q=0.9',
        language: 'en',
        region: 'Angers',
        'device-model': 'iPad8,6',
        'user-agent':
          'PonyBikes/5.13.1 (co.ponybikes.venus; build:80; iOS 16.1.0) Alamofire/5.6.2',
        'os-version': '16.1',
      },
    }
  );
  if (getTripsResult.ok) {
    const getTripsResultObj = await getTripsResult.json();
    return getTripsResultObj.trips;
  } else {
    setFailed('Could not get trips');

    throw new Error('Could not get trips', {
      cause: getTripsResult.status,
    });
  }
};

if (!import.meta.url) {
  const trips = await getTrips(process.env.USER_ID, process.env.ACCESS_TOKEN);

  setOutput('trips', trips);
}
