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

export function getDateArray(start, end) {
  const arr = [];
  const dt = new Date(start);
  const endDate = new Date(end);
  while (dt <= endDate) {
    arr.push(new Date(dt));
    dt.setDate(dt.getDate() + 1);
  }
  return arr;
}
