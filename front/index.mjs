import trips from '../trips.json' assert { type: 'json' };
import { createCanvas } from './get-canvas.mjs';
import { createGraphsPerDay } from './graph-per-day.mjs';
import { avg, median, duration } from './maths.mjs';
import '@picocss/pico/css/pico.css';

const rawTrips = trips
  .filter((t) => !t._id)
  .filter(
    (value, index, self) =>
      index === self.findIndex((t) => t.trip_id === value.trip_id)
  )
  .reverse();

console.log(`${rawTrips.length} trips`);
console.log(JSON.stringify(rawTrips));

console.log(
  `Premier trajet le ${new Date(rawTrips.at(0).startTime).toLocaleString('fr')}`
);
console.log(
  `Dernier trajet le ${new Date(rawTrips.at(-1).startTime).toLocaleString(
    'fr'
  )}`
);

const totalRevenue = rawTrips
  .map((t) => t.revenue)
  .reduce((total, d) => total + d, 0);
console.log(`Revenu total : ${(totalRevenue / 100).toFixed(3)}€`);
const totalDuration = rawTrips
  .map((t) => duration(t))
  .reduce((total, d) => total + d, 0);
console.log(`Durée totale : ${totalDuration / 1000}s`);

const avgRevenue = avg(rawTrips.map((t) => t.revenue));
console.log(`Revenu moyen : ${(avgRevenue / 100).toFixed(3)}€`);

const avgDuration = avg(rawTrips.map((t) => duration(t)));
console.log(`Durée moyenne : ${avgDuration / 1000}s`);

const medianRevenue = median(rawTrips.map((t) => t.revenue));
console.log(`Revenu médian : ${(medianRevenue / 100).toFixed(3)}€`);

const medianDuration = median(
  rawTrips.map(
    (t) => new Date(t.endTime).getTime() - new Date(t.startTime).getTime()
  )
);
console.log(`Durée médianne : ${medianDuration / 1000}s`);

const discountedTrips = rawTrips.filter((t) => t.discountReason);
console.log(
  `${discountedTrips.length} discounted trips (${Math.round(
    (discountedTrips.length / rawTrips.length) * 100
  )}%)`
);
const discountReasons = [
  ...new Set(discountedTrips.map((t) => t.discountReason)),
];
console.log(`Reasons: ${discountReasons.join(', ')}`);

createGraphsPerDay(rawTrips);

const revenueContinuousCtx = createCanvas('revenue', 'Revenue cummulé');
const summedRevenue = rawTrips.reduce(
  (acc, t) => {
    acc.push(acc.at(-1) + t.revenue);
    return acc;
  },
  [0]
);
summedRevenue.shift();
new Chart(revenueContinuousCtx, {
  type: 'line',
  data: {
    labels: rawTrips.map((t) => new Date(t.endTime).toLocaleString('fr')),
    datasets: [
      {
        label: 'Revenue',
        data: rawTrips.map((t) => t.revenue),
        borderWidth: 1,
        pointRadius: 2,
        showLine: false,
      },
      {
        label: 'Cumulated Revenue',
        data: summedRevenue.map((r) => r / 20),
        borderWidth: 1,
        pointRadius: 1,
      },
    ],
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});

const ponies = rawTrips.reduce((acc, t) => {
  if (!acc.includes(t.bikeName)) {
    acc.push(t.bikeName);
  }
  return acc;
}, []);
const maxTripRevenue = Math.max(...rawTrips.map((t) => t.revenue));
const avgRevenuePerPony = ponies.reduce((acc, pony) => {
  const ponyTrips = rawTrips.filter((t) => t.bikeName === pony);
  acc[pony] = avg(ponyTrips.map((t) => t.revenue));
  return acc;
}, {});
const medianRevenuePerPony = ponies.reduce((acc, pony) => {
  const ponyTrips = rawTrips.filter((t) => t.bikeName === pony);
  acc[pony] = median(ponyTrips.map((t) => t.revenue));
  return acc;
}, {});
ponies.forEach((pony) => {
  const canvas = createCanvas(`revenue-per-pony-${pony}`);
  new Chart(canvas, {
    type: 'line',
    data: {
      labels: rawTrips.map((t) => new Date(t.endTime).toLocaleString('fr')),
      datasets: [
        {
          label: pony,
          data: rawTrips.map((t) => (t.bikeName === pony ? t.revenue : 0)),
          borderWidth: 1,
          pointRadius: 2,
          showLine: false,
        },
        {
          label: `Average ${pony}`,
          data: rawTrips.map(() => avgRevenuePerPony[pony]),
          borderWidth: 1,
          pointRadius: 1,
          showLine: true,
        },
        {
          label: `Median ${pony}`,
          data: rawTrips.map(() => medianRevenuePerPony[pony]),
          borderWidth: 1,
          pointRadius: 1,
          showLine: true,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          max: 1000,
        },
      },
    },
  });
});
