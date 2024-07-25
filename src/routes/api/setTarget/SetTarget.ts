import { AuthAPIResponse } from '$lib/abstract/AuthAPIResponse';
import type { PrismaClient, Prisma } from '@prisma/client';
import type { DefaultArgs } from '@prisma/client/runtime/library';
import { error, type RequestEvent } from '@sveltejs/kit';

export class SetTargetForColumn extends AuthAPIResponse {
	async onCall(prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, props: {colId: string, targetAmount: string, length: string}) {
    let column = await prisma.column.findUnique({
      where: {
        id: Number( props.colId )
      },
      include: {
        target: true
      }
    })

    console.log(props.length)
    if (!( ['day', 'week', 'month'].includes(props.length) )) throw error(400, "Provide a proper length for the target")
    if (!column) throw error(404, "Column not found")
    if (!!column.target) throw error(400, "Target already exists on this column")

    return await prisma.target.create({
      data: {
        on: {
          connect: {
            id: Number( props.colId )
          }
        },
        targetValue: Number(props.targetAmount),
        length: props.length 
      }
    })
  }

	async getProps(event: RequestEvent<Partial<Record<string, string>>, string | null>) {
		let json = await event.request.json();

    let colId = json?.colId
    let targetAmount = json?.target
    let length = json?.timePeriod

    return {
      colId, 
      targetAmount, 
      length
    }

	}
}
