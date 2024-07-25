import { AuthAPIResponse } from '$lib/abstract/AuthAPIResponse';
import type { User } from '@auth/sveltekit';
import type { PrismaClient, Prisma } from '@prisma/client';
import type { DefaultArgs } from '@prisma/client/runtime/library';
import { TimeAdjustedQueryFactory } from '../getHistoricalData/[id]/GetHistoricalData.ts';
import { DateTime } from 'luxon';
import { error, type RequestEvent } from '@sveltejs/kit';

export class ScoreHistoricalData extends AuthAPIResponse {
	async onCall(
		prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
		props: { user: User; timePeriod: any }
	) {
		const now = DateTime.now();
		const firstDayOfYear = DateTime.fromObject({
			month: 1,
			day: 1,
			year: now.year
		});

		const toSubtract = {
			week: 7,
			month: 30,
			year: 365,
			ytd: firstDayOfYear.diffNow().days
		};

		const amountToSubtract: number | undefined = toSubtract[props.timePeriod];

		if (!amountToSubtract) {
			throw error(400, 'Provide a proper amount of time (week, month, year, ytd)');
		}

		const earliestPossibleDate = now.minus({ days: amountToSubtract });
		const data = await prisma.scoreRow.findMany({
			where: {
				userId: props.user.id,
				date: {
					gt: earliestPossibleDate.toJSDate()
				}
        
			},
      orderBy: {
        date: "asc"
      }
		});

		return data;
	}

	getProps(event: RequestEvent<Partial<Record<string, string>>, string | null>) {
		const json = event.params;

		const queryParams = event.url.searchParams;

		const period = queryParams.get('time') || 'week';

		return {
			timePeriod: period
		};
	}
}
