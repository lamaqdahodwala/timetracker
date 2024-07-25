import type { RequestHandler } from '@sveltejs/kit';
import { CreateColumn } from './CreateColumn';
import { prisma } from '$lib/db';

export const POST: RequestHandler = async (event) => {
	return await new CreateColumn(prisma, event).returnResponse();
};
