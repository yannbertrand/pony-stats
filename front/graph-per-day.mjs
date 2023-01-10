import { createCanvas } from './get-canvas.mjs';
import { avg, median } from './maths.mjs';

export const createGraphsPerDay = (rawTrips) => {
  const wholeRevenuePerDayCtx = createCanvas('revenue-per-day');
  const wholeRevenuesPerDay = rawTrips.reduce((acc, t) => {
    const date = new Date(t.endTime).toLocaleDateString('fr');
    if (!acc[date]) acc[date] = 0;
    acc[date] += t.revenue;
    return acc;
  }, {});
  const avgWholeRevenuePerDay = avg(Object.values(wholeRevenuesPerDay)).toFixed(
    3
  );
  const medianWholeRevenuePerDay = median(
    Object.values(wholeRevenuesPerDay)
  ).toFixed(3);
  new Chart(wholeRevenuePerDayCtx, {
    type: 'line',
    data: {
      labels: Object.keys(wholeRevenuesPerDay),
      datasets: [
        {
          label: 'Revenue/day',
          data: Object.values(wholeRevenuesPerDay),
          borderWidth: 1,
          showLine: false,
        },
        {
          label: `Median (${medianWholeRevenuePerDay})`,
          data: Object.values(wholeRevenuesPerDay).map(
            () => medianWholeRevenuePerDay
          ),
          borderWidth: 1,
          pointRadius: 1,
        },
        {
          label: `Average (${avgWholeRevenuePerDay})`,
          data: Object.values(wholeRevenuesPerDay).map(
            () => avgWholeRevenuePerDay
          ),
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
  ponies.forEach((bikeName) => {
    const ctx = createCanvas(`revenue-per-day-${bikeName}`);
    const revenuesPerDay = rawTrips
      .filter((t) => t.bikeName === bikeName)
      .reduce((acc, t) => {
        const date = new Date(t.endTime).toLocaleDateString('fr');
        if (!acc[date]) acc[date] = 0;
        acc[date] += t.revenue;
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
