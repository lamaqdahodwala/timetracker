import type { RequestHandler } from '@sveltejs/kit';
import { UpdateRow } from './UpdateRow';
import { prisma } from '$lib/db';

export const POST: RequestHandler = async (event) => {
	return await new UpdateRow(prisma, event).returnResponse();
};
