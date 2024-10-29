import trips from '../trips.json' with { type: 'json' };
import { transformTrips } from './transform-trips.js';
import { getBikes } from './get-bikes.js';
import { createStats } from './stats.js';
import { createGraphsPerDay } from './graph-per-day.js';
import { avg, median, duration } from './maths.js';
import '@picocss/pico/css/pico.css';

const rawTrips = trips
  .filter((value, index, self) => index === self.findIndex((t) => t.trip_id === value.trip_id))
  .filter((t) => t.revenue !== undefined)
  .reverse();

console.log(`${rawTrips.length} trips`);
console.log(JSON.stringify(rawTrips));

console.log(`Premier trajet le ${new Date(rawTrips.at(0).startTime).toLocaleString('fr')}`);
console.log(`Dernier trajet le ${new Date(rawTrips.at(-1).startTime).toLocaleString('fr')}`);

const totalRevenue = rawTrips.map((t) => t.revenue).reduce((total, d) => total + d, 0);
console.log(`Revenu total : ${(totalRevenue / 100).toFixed(3)}€`);
const totalDuration = rawTrips.map((t) => duration(t)).reduce((total, d) => total + d, 0);
console.log(`Durée totale : ${totalDuration / 1000}s`);

const avgRevenue = avg(rawTrips.map((t) => t.revenue));
console.log(`Revenu moyen : ${(avgRevenue / 100).toFixed(3)}€`);

const avgDuration = avg(rawTrips.map((t) => duration(t)));
console.log(`Durée moyenne : ${avgDuration / 1000}s`);

const medianRevenue = median(rawTrips.map((t) => t.revenue));
console.log(`Revenu médian : ${(medianRevenue / 100).toFixed(3)}€`);

const medianDuration = median(rawTrips.map((t) => new Date(t.endTime).getTime() - new Date(t.startTime).getTime()));
console.log(`Durée médianne : ${medianDuration / 1000}s`);

const discountedTrips = rawTrips.filter((t) => t.discountReason);
console.log(
  `${discountedTrips.length} discounted trips (${Math.round((discountedTrips.length / rawTrips.length) * 100)}%)`,
);
const discountReasons = [...new Set(discountedTrips.map((t) => t.discountReason))];
console.log(`Reasons: ${discountReasons.join(', ')}`);

const transformedTrips = transformTrips(rawTrips);
const bikes = getBikes(rawTrips);
createStats(transformedTrips);
createGraphsPerDay(transformedTrips, bikes);
