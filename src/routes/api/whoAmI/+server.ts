import type { RequestHandler } from '@sveltejs/kit';
import { WhoAmI } from './WhoAmI';
import { prisma } from '$lib/db';
import { CreateAPIRoute } from '$lib/helpers/RouteFactory';

export const GET = CreateAPIRoute.for(WhoAmI);
