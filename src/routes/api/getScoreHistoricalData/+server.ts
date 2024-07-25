import { CreateAPIRoute } from '$lib/helpers/RouteFactory';
import { ScoreHistoricalData } from './ScoreHistoricalData';

export const GET = CreateAPIRoute.for(ScoreHistoricalData);
