import { createCanvas } from './get-canvas.mjs';
import { avg, median, getWeek } from './maths.mjs';

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
  const datesStrings = dates.map((d) => d.toLocaleDateString('fr'));
  const weeksStrings = dates
    .filter((d) => d.getDay() === 1)
    .map((d) => d.toLocaleDateString('fr'));
  const wholeRevenuePerDayCtx = createCanvas(
    'revenue-per-day',
    'Revenue / jour'
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
      revenuesPerDay[t.day] += t.revenue;
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
          data: dates.map((date) => avgDailyRevenuePerWeek[getWeek(date)]),
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
