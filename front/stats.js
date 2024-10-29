import { createGrid } from './get-canvas.js';
import { avg, getDateArray } from './maths.js';

export function createStats(rawTrips) {
  const grid = createGrid('stats', 1);
  const last7DaysAverageRevenue = getLast7DaysAverageRevenue(rawTrips);

  const last7DaysAverageRevenueTitle = document.createElement('p');
  last7DaysAverageRevenueTitle.textContent =
    'Revenu quotidien moyen sur les 7 derniers jours';
  grid[0].appendChild(last7DaysAverageRevenueTitle);

  const last7DaysAverageRevenueStat = document.createElement('h2');
  last7DaysAverageRevenueStat.textContent = last7DaysAverageRevenue;
  grid[0].appendChild(last7DaysAverageRevenueStat);
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
