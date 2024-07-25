import { APIResponseTestable } from '$lib/abstract/APIResponseTestable';
import { AuthAPIResponse } from '$lib/abstract/AuthAPIResponse';
import type { User } from '@auth/sveltekit';
import type { PrismaClient, Prisma } from '@prisma/client';
import type { DefaultArgs } from '@prisma/client/runtime/library';
import type { RequestEvent } from '@sveltejs/kit';
import { error } from 'console';

export class GetColumnInfo extends AuthAPIResponse {
	async onCall(
		prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
		props: { id: number, user: User}
	) {
		let column =  await prisma.column.findUnique({
			where: {
				id: props.id
			}
		});

    if (column?.userId !== props.user.id){
      throw error(403, "Not authorized to access this column ID")
    }

    return column
	}

	async getProps(event: RequestEvent<Partial<Record<string, string>>, string | null>) {
		const params = event.params;

		return {
			id: Number(params.id)
		};
	}
}
