import { createCanvas } from './get-canvas.mjs';
import { avg, median } from './maths.mjs';

export const createGraphsPerDay = (rawTrips) => {
  rawTrips = rawTrips.filter(
    (t) => new Date(t.endTime) > new Date('2022-12-29')
  );
  const dates = [
    new Date('2022-12-29').toLocaleDateString('fr'),
    new Date('2022-12-30').toLocaleDateString('fr'),
    new Date('2022-12-31').toLocaleDateString('fr'),
    new Date('2023-01-01').toLocaleDateString('fr'),
    new Date('2023-01-02').toLocaleDateString('fr'),
    new Date('2023-01-03').toLocaleDateString('fr'),
    new Date('2023-01-04').toLocaleDateString('fr'),
    new Date('2023-01-05').toLocaleDateString('fr'),
    new Date('2023-01-06').toLocaleDateString('fr'),
    new Date('2023-01-07').toLocaleDateString('fr'),
    new Date('2023-01-08').toLocaleDateString('fr'),
    new Date('2023-01-09').toLocaleDateString('fr'),
    new Date('2023-01-10').toLocaleDateString('fr'),
    new Date('2023-01-11').toLocaleDateString('fr'),
    new Date('2023-01-12').toLocaleDateString('fr'),
    new Date('2023-01-13').toLocaleDateString('fr'),
    new Date('2023-01-14').toLocaleDateString('fr'),
    new Date('2023-01-15').toLocaleDateString('fr'),
    new Date('2023-01-16').toLocaleDateString('fr'),
    new Date('2023-01-17').toLocaleDateString('fr'),
    new Date('2023-01-18').toLocaleDateString('fr'),
    new Date('2023-01-19').toLocaleDateString('fr'),
    new Date('2023-01-20').toLocaleDateString('fr'),
    new Date('2023-01-21').toLocaleDateString('fr'),
    new Date('2023-01-22').toLocaleDateString('fr'),
    new Date('2023-01-23').toLocaleDateString('fr'),
    new Date('2023-01-24').toLocaleDateString('fr'),
    new Date('2023-01-25').toLocaleDateString('fr'),
    new Date('2023-01-26').toLocaleDateString('fr'),
    new Date('2023-01-27').toLocaleDateString('fr'),
    new Date('2023-01-28').toLocaleDateString('fr'),
    new Date('2023-01-29').toLocaleDateString('fr'),
    new Date('2023-01-30').toLocaleDateString('fr'),
    new Date('2023-01-31').toLocaleDateString('fr'),
    new Date('2023-02-01').toLocaleDateString('fr'),
    new Date('2023-02-02').toLocaleDateString('fr'),
    new Date('2023-02-03').toLocaleDateString('fr'),
    new Date('2023-02-04').toLocaleDateString('fr'),
    new Date('2023-02-05').toLocaleDateString('fr'),
  ];
  const wholeRevenuePerDayCtx = createCanvas(
    'revenue-per-day',
    'Revenue / jour'
  );
  const wholeRevenuesPerDayPerGinette = dates.reduce((acc, date) => {
    acc[date] =
      rawTrips
        .filter((t) => t.bikeName === 'Ginette')
        .filter((t) => new Date(t.endTime).toLocaleDateString('fr') === date)
        .reduce((sum, t) => {
          sum += t.revenue;
          return sum;
        }, 0) || 0;
    return acc;
  }, {});
  const wholeRevenuesPerDayPerHenriette = dates.reduce((acc, date) => {
    acc[date] =
      rawTrips
        .filter((t) => t.bikeName === 'Henriette')
        .filter((t) => new Date(t.endTime).toLocaleDateString('fr') === date)
        .reduce((sum, t) => {
          sum += t.revenue;
          return sum;
        }, 0) || 0;
    return acc;
  }, {});
  const wholeRevenuesPerDay = dates.reduce((acc, date) => {
    acc[date] =
      rawTrips
        .filter((t) => new Date(t.endTime).toLocaleDateString('fr') === date)
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
        // {
        //   label: 'Revenue/day',
        //   data: Object.values(wholeRevenuesPerDay),
        //   borderWidth: 1,
        //   showLine: false,
        // },
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
      acc[date] =
        rawTrips
          .filter((t) => t.bikeName === bikeName)
          .filter((t) => new Date(t.endTime).toLocaleDateString('fr') === date)
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
      const date = new Date(t.endTime).toLocaleDateString('fr');
      if (revenuesPerDay[date] === undefined) {
        acc[date] = 0;
      } else {
        acc[date] = revenuesPerDay[date];
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
