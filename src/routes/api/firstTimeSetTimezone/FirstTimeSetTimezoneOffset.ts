import type { User } from '@auth/sveltekit';
import type { PrismaClient, Prisma } from '@prisma/client';
import type { DefaultArgs } from '@prisma/client/runtime/library';
import { SetTimezoneOffset } from '../setTimezone/SetOffset';
import { error } from 'console';
import { AuthAPIResponse } from '$lib/abstract/AuthAPIResponse';
import type { RequestEvent } from '@sveltejs/kit';

export class FirstTimeSetOffset extends AuthAPIResponse {
	async onCall(
		prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
		props: { user: User; zoneName: string }
	): Promise<{ timezone: string}> {
		let user = await prisma.user.findUnique({
			where: {
				id: props.user.id
			}
		});

    console.log(user)
		if (!user) throw error(500);

		if (!user.timezone) {
      await prisma.user.update({
        where: {
          id: props.user.id
        },
        data: {
          timezone: props.zoneName
        }
      })
		}
		return {
			timezone: user?.timezone || "UTC"
		};
	}

  async getProps(event: RequestEvent<Partial<Record<string, string>>, string | null>) {
      let json = await event.request.json()

    return {
      zoneName: json.zoneName
    }
  }
}
