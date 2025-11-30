import { appendFile, writeFile } from 'node:fs/promises';
import trips from '../trips.json' with { type: 'json' };

export const updateTripsFile = async (newTrips) => {
	const firstDuplicateIndex = newTrips.findIndex(
		(trip) => trip.trip_id === trips[0].trip_id,
	);
	if (firstDuplicateIndex > -1) {
		newTrips.splice(firstDuplicateIndex, newTrips.length);
	}

	const allTrips = [...newTrips, ...trips];

	await updateJsonFile(allTrips);
	await updateCsvFile(newTrips);

	return newTrips;
};

const updateJsonFile = async (allTrips) => {
	await writeFile('trips.json', JSON.stringify(allTrips), 'utf8');
};

const updateCsvFile = async (newTrips) => {
	const newCsvLines = newTrips.reverse().map((t) => {
		const tripId = t._id ?? t.tripId ?? '';
		const startTime = t.startTime;
		const endTime = t.endTime;
		const bikeId = t.bikeId ?? t.vehicleId ?? t.lockId;
		const revenue = t.revenue ?? '';
		const currency = t.currency ?? t.revenueCurrency ?? '';
		const discountReason = t.discountReason ?? '';
		return `${tripId},${startTime},${endTime},${bikeId},${revenue},${currency},${discountReason}`;
	});

	if (newCsvLines.length > 0) {
		await appendFile(
			'./front/public/trips.csv',
			`${newCsvLines.join('\n')}\n`,
			'utf8',
		);
	}
};
