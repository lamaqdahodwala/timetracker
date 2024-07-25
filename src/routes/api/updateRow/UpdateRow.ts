import { APIResponseTestable } from '$lib/abstract/APIResponseTestable';
import type { PrismaClient, Prisma } from '@prisma/client';
import type { DefaultArgs } from '@prisma/client/runtime/library';
import { MoveDataToHistorical } from '../getTodaysStats/moveDataToHistorical';
import type { RequestEvent } from '../$types';
import { AuthAPIResponse } from '$lib/abstract/AuthAPIResponse';
import type { User } from '@auth/sveltekit';

export type UpdateRowInput = {
	colId: number;
	newValue: number;
};

export type UpdateRowResult = {
	id: number;
	name: string;
	today: string;
};

export class UpdateRow extends AuthAPIResponse {
	async onCall(
		prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
		props: { json: UpdateRowInput, user: User }
	) {
		return await prisma.column.update({
			where: {
				id: Number(props.json.colId),
        userId: props.user.id
			},
			data: {
				today: Number(props.json.newValue)
			},
			select: {
				id: true,
				name: true,
				today: true
			}
		});
	}

	async getProps(event: RequestEvent) {
		return {
			json: await event.request.json()
		};
	}
}
