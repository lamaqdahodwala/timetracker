import { CreateAPIRoute } from '$lib/helpers/RouteFactory';
import { GetHistoricalData } from './GetHistoricalData';

export const GET = CreateAPIRoute.for(GetHistoricalData);
