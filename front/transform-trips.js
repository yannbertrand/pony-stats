import { duration, getWeek } from './maths.js';

export function transformTrips(rawTrips) {
	return rawTrips.map((t) => ({
		...t,
		day: new Date(t.endTime).toLocaleDateString('fr'),
		week: getWeek(new Date(t.endTime)),
		duration: duration(t),
		revenue: t.revenue / 100,
		cost: t.cost / 100,
	}));
}
