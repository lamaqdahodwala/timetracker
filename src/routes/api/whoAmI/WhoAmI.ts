import { AuthAPIResponse } from '$lib/abstract/AuthAPIResponse';
import type { PrismaClient, Prisma } from '@prisma/client';
import type { DefaultArgs } from '@prisma/client/runtime/library';

export class WhoAmI extends AuthAPIResponse {
	async onCall(prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, props: any) {
		return { user: props.user };
	}

	async notAuthenticated() {
		return {
			user: null
		};
	}
}
