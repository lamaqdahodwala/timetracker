import { APIResponseTestable } from '$lib/abstract/APIResponseTestable';
import { AuthAPIResponse } from '$lib/abstract/AuthAPIResponse';
import type { User } from '@auth/sveltekit';
import type { PrismaClient, Prisma } from '@prisma/client';
import type { DefaultArgs } from '@prisma/client/runtime/library';
import type { RequestEvent } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

export class UpdateColumn extends AuthAPIResponse {
	async onCall(
		prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
		props: {
			colId: string;
			type: string | undefined;
			factor: string | undefined;
			name: string | undefined;
			threshold: string | undefined;
			stackable: string | undefined;
      user: User
		}
	) {
    let column = await prisma.column.findUnique({
      where: {
        id: props.colId
      }
    })

    if (column?.userId !== props.user.id){
      throw error(403, "Not authorized to access this column ID")
    }
		const newCol = await prisma.column.update({
			where: {
				id: Number(props.colId)
			},
			data: {
				name: props.name,
				threshold: Number(props.threshold),
				type: props.type,
				factor: Number(props.factor),
				stackable: Boolean(Number(props.stackable))
			}
		});

		return {
			success: true,
			newCol: newCol
		};
	}

	async getProps(event: RequestEvent<Partial<Record<string, string>>, string | null>) {
		const json = await event.request.json();

		if (
			!['additive', 'subtractive', 'multiplicative', 'divisive'].includes(json.colType) &&
			json.colType !== undefined
		) {
			throw error(400, 'Please select a valid column type');
		}

		return {
			colId: json.colId,
			type: json.colType,
			factor: json.factor,
			name: json.colName,
			threshold: json.threshold,
			stackable: json.stackable
		};
	}
}
