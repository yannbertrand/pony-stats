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
  const wholeRevenuesPerDayPerGinette = dates.reduce((acc, date) => {
    acc[date.toLocaleDateString('fr')] =
      rawTrips
        .filter((t) => t.bikeName === 'Ginette')
        .filter((t) => t.day === date.toLocaleDateString('fr'))
        .reduce((sum, t) => {
          sum += t.revenue;
          return sum;
        }, 0) || 0;
    return acc;
  }, {});
  const wholeRevenuesPerDayPerHenriette = dates.reduce((acc, date) => {
    acc[date.toLocaleDateString('fr')] =
      rawTrips
        .filter((t) => t.bikeName === 'Henriette')
        .filter((t) => t.day === date.toLocaleDateString('fr'))
        .reduce((sum, t) => {
          sum += t.revenue;
          return sum;
        }, 0) || 0;
    return acc;
  }, {});
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
      labels: Object.keys(wholeRevenuesPerDay),
      datasets: [
        {
          label: 'Ginette Revenue/day',
          data: Object.values(wholeRevenuesPerDayPerGinette),
          borderWidth: 1,
          showLine: false,
          stack: 'Stack 0',
        },
        {
          label: 'Henriette Revenue/day',
          data: Object.values(wholeRevenuesPerDayPerHenriette),
          borderWidth: 1,
          showLine: false,
          stack: 'Stack 0',
        },
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

  const ponies = rawTrips.reduce((acc, t) => {
    if (!acc.includes(t.bikeName)) {
      acc.push(t.bikeName);
    }
    return acc;
  }, []);
  ponies.forEach((bikeName) => {
    const ctx = createCanvas(`revenue-per-day-${bikeName}`);

    const revenuesPerDay = dates.reduce((acc, date) => {
      acc[date.toLocaleDateString('fr')] =
        rawTrips
          .filter((t) => t.bikeName === bikeName)
          .filter((t) => t.day === date.toLocaleDateString('fr'))
          .reduce((sum, t) => {
            sum += t.revenue;
            return sum;
          }, 0) || 0;
      return acc;
    }, {});
    const firstTripDate = Object.keys(revenuesPerDay)[0];
    const avgRevenuePerDay = avg(Object.values(revenuesPerDay)).toFixed(3);
    const medianRevenuePerDay = median(Object.values(revenuesPerDay)).toFixed(
      3
    );
    const paddedRevenuesPerDay = rawTrips.reduce((acc, t) => {
      if (revenuesPerDay[t.day] === undefined) {
        acc[t.day] = 0;
      } else {
        acc[t.day] = revenuesPerDay[t.day];
      }
      return acc;
    }, {});
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: Object.keys(paddedRevenuesPerDay),
        datasets: [
          {
            label: `Revenue/day ${bikeName}`,
            data: Object.values(paddedRevenuesPerDay),
            borderWidth: 1,
            showLine: false,
            type: 'bar',
          },
          {
            label: `Median (${medianRevenuePerDay})`,
            data: Object.values(paddedRevenuesPerDay).map(
              () => medianRevenuePerDay
            ),
            borderWidth: 1,
            pointRadius: 1,
          },
          {
            label: `Average (${avgRevenuePerDay})`,
            data: Object.values(paddedRevenuesPerDay).map(
              () => avgRevenuePerDay
            ),
            borderWidth: 1,
            pointRadius: 1,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            title: {
              display: true,
              text: `${bikeName} ${firstTripDate} - ?`,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  });
};
