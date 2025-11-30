import { writeFile } from 'node:fs/promises';

export const updateBikesFile = async (allBikes) => {
	console.log(allBikes);
	await updateJsonFile(allBikes);
	await updateCsvFile(allBikes);

	return allBikes;
};

const updateJsonFile = async (allBikes) => {
	await writeFile('bikes.json', JSON.stringify(allBikes), 'utf8');
};

const updateCsvFile = async (allBikes) => {
	const header = `"bikeId","name","region","status","acquisitionDate","insuranceEnd","ageInDays","totalRides","totalPaidTripsDone","totalRevenue","currency"\n`;
	const csvLines = allBikes.map((b) => {
		const bikeId = b.vehicle_id ?? b._id;
		const name = b.name;
		const region = b.region;
		const status = b.status;
		const acquisitionDate = b.acquisitionDate;
		const insuranceEnd = b.insuranceEnd;
		const ageInDays = b.age_in_days;
		const totalRides = b.totalRides;
		const totalPaidTripsDone = b.total_paid_trips_done;
		const totalRevenue = b.totalRevenue.amount;
		const currency = b.totalRevenue.currency;
		return `${bikeId},${name},${region},${status},${acquisitionDate},${insuranceEnd},${ageInDays},${totalRides},${totalPaidTripsDone},${totalRevenue},${currency}`;
	});

	await writeFile(
		'front/public/bikes.csv',
		`${header}${csvLines.join('\n')}\n`,
		'utf8',
	);
};
