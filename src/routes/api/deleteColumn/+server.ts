import { CreateAPIRoute } from '$lib/helpers/RouteFactory';
import { DeleteColumn } from './DeleteColumn.ts';

export const POST = CreateAPIRoute.for(DeleteColumn);
