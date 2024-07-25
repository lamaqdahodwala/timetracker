import { CreateAPIRoute } from '$lib/helpers/RouteFactory';
import { GetColumnInfo } from './GetColumnInfo';

export const GET = CreateAPIRoute.for(GetColumnInfo);
