import type { APIResponseTestable } from '$lib/abstract/APIResponseTestable';
import { prisma } from '$lib/db';
import type { RequestHandler } from '@sveltejs/kit';

export class CreateAPIRoute {
	static for(response: new () => APIResponseTestable): RequestHandler {
		const func: RequestHandler = async (event) => {
			return await new response(prisma, event).returnResponse();
		};
		return func;
	}
}
