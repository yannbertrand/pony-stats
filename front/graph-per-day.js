import Chart from 'chart.js/auto';
import { createMainCanvas } from './get-canvas.js';
import { avg, median, getWeek, getDateArray } from './maths.js';

export const createGraphsPerDay = (rawTrips, bikes) => {
  rawTrips = rawTrips.reverse();
  const today = new Date();
  const dates = getDateArray(
    today.setMonth(today.getMonth() - 6),
    new Date()
  ).reverse();
  const datesStrings = dates.map((d) => d.toLocaleDateString('fr'));
  const weeksStrings = dates
    .filter((d) => d.getDay() === 1)
    .map((d) => d.toLocaleDateString('fr'));
  const wholeRevenuePerDayCtx = createMainCanvas(
    'revenue-per-day',
    'Revenue / jour',
    dates.length * 3
  );
  const wholeRevenuesPerDayPerBikes = Object.keys(bikes).map((bikeName) => {
    return {
      bikeName,
      wholeRevenuesPerDayPerBike: datesStrings.reduce((acc, date) => {
        acc[date] =
          rawTrips
            .filter((t) => t.bikeName === bikeName)
            .filter((t) => t.day === date)
            .reduce((sum, t) => {
              sum += t.revenue;
              return sum;
            }, 0) || 0;
        return acc;
      }, {}),
    };
  });
  const wholeRevenuesPerDay = rawTrips.reduce(
    (revenuesPerDay, t) => {
      if (revenuesPerDay[t.day] !== undefined) {
        revenuesPerDay[t.day] += t.revenue;
      }
      return revenuesPerDay;
    },
    datesStrings.reduce(
      (acc, d) => ({
        ...acc,
        [d]: 0,
      }),
      {}
    )
  );
  const revenuePerWeek = rawTrips.reduce(
    (acc, t) => {
      acc[t.week] += t.revenue;
      return acc;
    },
    weeksStrings.reduce(
      (acc, w) => ({
        ...acc,
        [w]: 0,
      }),
      {}
    )
  );
  const avgDailyRevenuePerWeek = Object.keys(revenuePerWeek).reduce(
    (acc, key) => {
      acc[key] = revenuePerWeek[key] / 7.0;
      return acc;
    },
    {}
  );
  const avgWholeRevenuePerDay = avg(Object.values(wholeRevenuesPerDay)).toFixed(
    3
  );
  const medianWholeRevenuePerDay = median(
    Object.values(wholeRevenuesPerDay)
  ).toFixed(3);
  new Chart(wholeRevenuePerDayCtx, {
    type: 'bar',
    data: {
      labels: datesStrings,
      datasets: [
        ...wholeRevenuesPerDayPerBikes.map(
          ({ bikeName, wholeRevenuesPerDayPerBike }) => ({
            label: bikeName,
            data: Object.values(wholeRevenuesPerDayPerBike),
            borderWidth: 1,
            showLine: false,
            stack: 'Stack 0',
          })
        ),
        {
          label: `6M Median (${medianWholeRevenuePerDay})`,
          data: Object.values(wholeRevenuesPerDay).map(
            () => medianWholeRevenuePerDay
          ),
          borderWidth: 1,
          pointRadius: 1,
          type: 'line',
        },
        {
          label: `W Average (6M ${avgWholeRevenuePerDay})`,
          data: dates.map((date) => avgDailyRevenuePerWeek[getWeek(date)]),
          borderWidth: 1,
          pointRadius: 1,
          type: 'line',
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      indexAxis: 'y',
      responsive: true,
      scales: {
        x: {
          gridLines: {
            display: true,
            tickLength: 2,
          },
        },
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};
