import { AuthAPIResponse } from "$lib/abstract/AuthAPIResponse";
import type { User } from "@auth/sveltekit";
import type { Prisma, PrismaClient } from "@prisma/client";
import type { DefaultArgs } from "@prisma/client/runtime/library";
import { error, type RequestEvent } from "@sveltejs/kit";

export class DeleteTarget extends AuthAPIResponse {
  async onCall(prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, props: {user: User, columnId: string}) {
      let column = await prisma.column.findUnique({
      where: {
        id: Number(props.columnId)
      },
      include: {
        target: true
      }
    })

    if (!column) throw error(404, "Column Not Found")

    if (!column.target) throw error(400, "Target not found")


    await prisma.target.delete({
      where: {
        columnId: column.id
      }
    })

    return {
      success: true
    }
  }

  async getProps(event: RequestEvent<Partial<Record<string, string>>, string | null>) {
      let json = await event.request.json()

      let columnId = json?.columnId

      if (!columnId) throw error(400, "Provide a column ID")
  

      return {
      columnId
    }

  }
}
