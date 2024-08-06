import { AuthAPIResponse } from '$lib/abstract/AuthAPIResponse';
import type { User } from '@auth/sveltekit';
import type { PrismaClient, Prisma } from '@prisma/client';
import type { DefaultArgs } from '@prisma/client/runtime/library';
import type { RequestEvent } from '@sveltejs/kit';

export class SetTimezoneOffset extends AuthAPIResponse {
	async onCall(
		prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
		props: { user: User; offset: string }
	) {
		let updatedUser = await prisma.user.update({
			where: {
				id: props.user.id
			},
			data: {
				timezone: props.offset
			}
		});

    return {
      timezone: updatedUser.timezone
    }
	}

	async getProps(event: RequestEvent<Partial<Record<string, string>>, string | null>) {
		let json = await event.request.json();

		let offset = json.offset;

		return {
			offset: String(offset)
		};
	}
}
