import { APIResponseTestable } from '$lib/abstract/APIResponseTestable';
import type { Prisma, PrismaClient } from '@prisma/client';
import type { DefaultArgs } from '@prisma/client/runtime/library';
import { MoveDataToHistorical } from './moveDataToHistorical';
import type { RequestEvent } from '@sveltejs/kit';
import { AuthAPIResponse } from '$lib/abstract/AuthAPIResponse';
import type { User } from '@auth/sveltekit';
import { CreateColumn } from '../createColumn/CreateColumn';

export type TodaysStats = {
	columns: {
		name: string;
		today: number;
		id: number;
	}[];
};

export class GetTodaysStats extends AuthAPIResponse {
	async onCall(
		prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
		props: { user: User }
	): Promise<TodaysStats> {
		const cols = await prisma.column.findMany({
			select: {
				name: true,
				today: true,
				id: true
			},
			where: {
				user: {
					id: props.user?.id
				}
			}
		});

		if (cols.length === 0) {
			await prisma.column.create({
				data: {
					user: {
						connect: {
							id: props.user?.id
						}
					},
					name: 'Minutes Worked',
					today: 0,
					stackable: true
				}
			});
			return this.onCall(prisma, props);
		}

		return {
			columns: cols
		};
	}
}
