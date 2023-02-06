export function avg(values) {
  return values.reduce((avg, v) => avg + v, 0) / values.length;
}

export function median(values) {
  if (values.length === 0) throw new Error('No inputs');

  values.sort(function (a, b) {
    return a - b;
  });

  var half = Math.floor(values.length / 2);

  if (values.length % 2) return values[half];

  return (values[half - 1] + values[half]) / 2.0;
}

export function duration(t) {
  return new Date(t.endTime).getTime() - new Date(t.startTime).getTime();
}

export function getWeek(date) {
  while (date.getDay() !== 1) {
    date.setDate(date.getDate() - 1);
  }
  return date.toLocaleDateString('fr');
}
