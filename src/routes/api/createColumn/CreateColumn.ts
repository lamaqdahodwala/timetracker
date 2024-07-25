import { APIResponseTestable } from '$lib/abstract/APIResponseTestable';
import { AuthAPIResponse } from '$lib/abstract/AuthAPIResponse';
import { prisma } from '$lib/db';
import type { PrismaClient, Prisma } from '@prisma/client';
import type { DefaultArgs } from '@prisma/client/runtime/library';
import { error, type RequestEvent, type RequestHandler } from '@sveltejs/kit';
import type { User } from '@auth/sveltekit';

export type CreateColumnReturn = {
	name: string;
	id: number;
	today: number;
};
export class CreateColumn extends AuthAPIResponse {
	async onCall(
		prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
		props: {
			colName: string;
			threshold: string;
			type: string;
			factor: string;
			stackable: boolean;
			user: User;
		}
	): Promise<CreateColumnReturn> {
		const valid_types = ['additive', 'subtractive', 'multiplicative', 'divisive'];

		if (!valid_types.includes(props.type)) throw error(400, 'Provide a correct type');
		const column = await prisma.column.create({
			data: {
				name: props.colName,
				threshold: Number(props.threshold),
				type: props.type,
				factor: Number(props.factor),
				stackable: props.stackable,
				today: 0,
				user: {
					connect: {
						id: props.user.id
					}
				}
			},
			select: {
				name: true,
				id: true,
				today: true
			}
		});

		return column;
	}

	async getProps(event: RequestEvent<Partial<Record<string, string>>, string | null>) {
		let { colName, threshold, colType, factor, stackable } = await event.request.json();

		if (!threshold) {
			threshold = '0';
		}
		if (!colType) {
			colType = 'additive';
		}
		if (!factor) {
			factor = '1';
		}
		if (!colName) {
			throw error(400, "Provide a name for your column in the argument 'colName'");
		}
		return {
			colName: colName,
			threshold: threshold,
			type: colType,
			factor: factor,
			stackable: Boolean(Number(stackable))
		};
	}
}
