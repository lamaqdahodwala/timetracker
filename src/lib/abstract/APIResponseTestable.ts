import type { PrismaClient } from '@prisma/client';
import type { RequestEvent } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export abstract class APIResponseTestable<T = any> {
	prisma: PrismaClient;
	event: RequestEvent;

	abstract onCall(prisma: PrismaClient, props: any): T | Promise<T>;

	constructor(prisma: PrismaClient, event: RequestEvent<{}, string | null>) {
		this.prisma = prisma;
		this.event = event;
	}

	async call(): Promise<T> {
		return await this.onCall(this.prisma, await this.getProps(this.event));
	}

	getOnCallMethod() {
		return this.onCall;
	}

	getProps(event: RequestEvent): any {}

	async returnResponse(): Promise<Response> {
		return json(await this.call());
	}

	getPrismaInstance() {
		return this.prisma;
	}
}
