import type { RequestHandler } from '@sveltejs/kit';
import { CalculateScore } from './CalculateScore';
import { prisma } from '$lib/db';

export const GET: RequestHandler = async (event) => {
	return await new CalculateScore(prisma, event).returnResponse();
};
