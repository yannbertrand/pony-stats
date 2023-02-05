import { createCanvas } from './get-canvas.mjs';
import { avg, median } from './maths.mjs';

function getDateArray(start, end) {
  const arr = [];
  const dt = new Date(start);
  const endDate = new Date(end);
  while (dt <= endDate) {
    arr.push(new Date(dt));
    dt.setDate(dt.getDate() + 1);
  }
  return arr;
}

export const createGraphsPerDay = (rawTrips, bikes) => {
  const dates = getDateArray(rawTrips.at(0).endTime, rawTrips.at(-1).endTime);
  const wholeRevenuePerDayCtx = createCanvas(
    'revenue-per-day',
    'Revenue / jour'
  );
  const wholeRevenuesPerDayPerPonies = Object.keys(bikes)
    .map((bikeName) => {
      return {
        bikeName,
        wholeRevenuesPerDayPerBike: dates.reduce((acc, date) => {
          acc[date.toLocaleDateString('fr')] =
            rawTrips
              .filter((t) => t.bikeName === bikeName)
              .filter((t) => t.day === date.toLocaleDateString('fr'))
              .reduce((sum, t) => {
                sum += t.revenue;
                return sum;
              }, 0) || 0;
          return acc;
        }, {}),
      };
    })
    .map(({ bikeName, wholeRevenuesPerDayPerBike }) => ({
      label: bikeName,
      data: Object.values(wholeRevenuesPerDayPerBike),
      borderWidth: 1,
      showLine: false,
      stack: 'Stack 0',
    }));
  console.log(wholeRevenuesPerDayPerPonies);
  const wholeRevenuesPerDay = dates.reduce((acc, date) => {
    acc[date.toLocaleDateString('fr')] =
      rawTrips
        .filter((t) => t.day === date.toLocaleDateString('fr'))
        .reduce((sum, t) => {
          sum += t.revenue;
          return sum;
        }, 0) || 0;
    return acc;
  }, {});
  const avgWholeRevenuePerDay = avg(Object.values(wholeRevenuesPerDay)).toFixed(
    3
  );
  const medianWholeRevenuePerDay = median(
    Object.values(wholeRevenuesPerDay)
  ).toFixed(3);
  new Chart(wholeRevenuePerDayCtx, {
    type: 'bar',
    data: {
      labels: dates.map((d) => d.toLocaleDateString('fr')),
      datasets: [
        ...wholeRevenuesPerDayPerPonies,
        {
          label: `Median (${medianWholeRevenuePerDay})`,
          data: Object.values(wholeRevenuesPerDay).map(
            () => medianWholeRevenuePerDay
          ),
          borderWidth: 1,
          pointRadius: 1,
          type: 'line',
        },
        {
          label: `Average (${avgWholeRevenuePerDay})`,
          data: Object.values(wholeRevenuesPerDay).map(
            () => avgWholeRevenuePerDay
          ),
          borderWidth: 1,
          pointRadius: 1,
          type: 'line',
        },
      ],
    },
    options: {
      scales: {
        // x: {
        //   type: 'timeseries',
        // },
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};
