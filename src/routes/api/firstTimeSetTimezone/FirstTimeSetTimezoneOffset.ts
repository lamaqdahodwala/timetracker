import type { User } from '@auth/sveltekit';
import type { PrismaClient, Prisma } from '@prisma/client';
import type { DefaultArgs } from '@prisma/client/runtime/library';
import { SetTimezoneOffset } from '../setTimezoneOffset/SetOffset';
import { error } from 'console';

export class FirstTimeSetOffset extends SetTimezoneOffset {
	async onCall(
		prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
		props: { user: User; offset: number }
	): Promise<{ offset: number | null }> {
		let user = await prisma.user.findUnique({
			where: {
				id: props.user.id
			}
		});

		if (!user) throw error(500);

		if (!user.timezone) {
			super.call();
		}
		return {
			offset: user?.timezone
		};
	}
}
