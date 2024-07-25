import { APIResponseTestable } from '$lib/abstract/APIResponseTestable';
import { AuthAPIResponse } from '$lib/abstract/AuthAPIResponse';
import type { User } from '@auth/sveltekit';
import type { PrismaClient, Prisma } from '@prisma/client';
import type { DefaultArgs } from '@prisma/client/runtime/library';
import { error, type RequestEvent } from '@sveltejs/kit';

export class DeleteColumn extends AuthAPIResponse {
	async onCall(
		prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
		props: { colId: number, user: User }
	) {
    let column = await prisma.column.findUnique({
      where: {
        id: props.colId
      }
    })
    if (column?.userId !== props.user.id){
      throw error(403, "Not authorized to access this column ID")
    }
		await prisma.column.delete({
			where: {
				id: props.colId
			}
		});

		return {
			success: true
		};
	}

	async getProps(event: RequestEvent<Partial<Record<string, string>>, string | null>) {
		const json = await event.request.json();

		const colId = json.colId;

		if (!colId) {
			throw error(400, 'Please provide a column ID');
		}

		return {
			colId: Number(colId)
		};
	}
}
