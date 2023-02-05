export function transformTrips(rawTrips) {
  return rawTrips.map((t) => ({
    ...t,
    day: new Date(t.endTime).toLocaleDateString('fr'),
    duration: new Date(t.endTime).getTime() - new Date(t.startTime).getTime(),
    revenue: t.revenue / 100,
    cost: t.cost / 100,
  }));
}
