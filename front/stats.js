import { createGrid } from './get-canvas.js';
import { avg, getDateArray } from './maths.js';

export function createStats(rawTrips) {
  const grid = createGrid('stats', 1);
  const last7DaysAverageRevenue = getLast7DaysAverageRevenue(rawTrips);
  const last30DaysRevenue = getLast30DaysRevenue(rawTrips);

  const last7DaysAverageRevenueTitle = document.createElement('p');
  last7DaysAverageRevenueTitle.textContent =
    'Revenu quotidien moyen sur les 7 derniers jours';
  grid[0].appendChild(last7DaysAverageRevenueTitle);

  const last7DaysAverageRevenueStat = document.createElement('h2');
  last7DaysAverageRevenueStat.textContent = last7DaysAverageRevenue;
  last7DaysAverageRevenueStat.style.cssText = 'text-align: right';
  grid[0].appendChild(last7DaysAverageRevenueStat);

  const last30DaysRevenueTitle = document.createElement('p');
  last30DaysRevenueTitle.textContent = 'Revenu total sur les 30 derniers jours';
  grid[0].appendChild(last30DaysRevenueTitle);

  const last30DaysRevenueStat = document.createElement('h2');
  last30DaysRevenueStat.textContent = last30DaysRevenue;
  last30DaysRevenueStat.style.cssText = 'text-align: right';
  grid[0].appendChild(last30DaysRevenueStat);
}

function getLast7DaysAverageRevenue(rawTrips) {
  const datesStrings = getDateArray(rawTrips.at(0).endTime, new Date()).map(
    (d) => d.toLocaleDateString('fr')
  );
  const last7Days = datesStrings.slice(-7);

  const revenuePerDay = rawTrips.reduce(
    (revenuesPerDay, t) => {
      if (revenuesPerDay[t.day] !== undefined) {
        revenuesPerDay[t.day] += t.revenue;
      }
      return revenuesPerDay;
    },
    last7Days.reduce((acc, d) => ({ ...acc, [d]: 0 }), {})
  );

  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 3,
  }).format(avg(Object.values(revenuePerDay)));
}

function getLast30DaysRevenue(rawTrips) {
  const now = new Date();
  const date30DaysAgo = new Date(now.setDate(now.getDate() - 30));

  const totalRevenue = rawTrips
    .filter((trip) => new Date(trip.startTime) >= date30DaysAgo)
    .reduce((sum, { revenue }) => {
      return sum + revenue;
    }, 0);

  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 3,
  }).format(totalRevenue);
}
