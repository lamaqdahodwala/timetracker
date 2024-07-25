import type { RequestHandler } from '@sveltejs/kit';
import { UpdateColumn } from './UpdateColumn';
import { prisma } from '$lib/db';

export const POST: RequestHandler = async (event) => {
	return new UpdateColumn(prisma, event).returnResponse();
};
