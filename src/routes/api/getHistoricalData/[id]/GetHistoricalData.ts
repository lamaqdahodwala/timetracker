import { AuthAPIResponse } from '$lib/abstract/AuthAPIResponse';
import type { User } from '@auth/sveltekit';
import type { PrismaClient, Prisma } from '@prisma/client';
import type { DefaultArgs } from '@prisma/client/runtime/library';
import { error, type RequestEvent } from '@sveltejs/kit';
import { DateTime } from 'luxon';

export class GetHistoricalData extends AuthAPIResponse {
	async onCall(
		prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
		props: { user: User; colId: number; timePeriod: string }
	) {
    let col = await prisma.column.findUnique({
      where: {
        id: props.colId
      }
    })

    if (col?.userId !== props.user.id){
      throw error(403, "Not authorized to access this column ID")
    }

		let data = await TimeAdjustedQueryFactory.createFindManyQueryForTimePeriod(
			prisma.row,
			props.timePeriod,
			props.colId
		).execute();


		return data;
	}

	async getProps(event: RequestEvent<Partial<Record<string, string>>, string | null>) {
		const json = event.params;

		const queryParams = event.url.searchParams;

		const period = queryParams.get('time') || 'week';

		return {
			colId: Number(json.id),
			timePeriod: period
		};
	}
}

export class TimeAdjustedQueryFactory {
	private callback: () => any;
	constructor(callback: () => any) {
		this.callback = callback;
	}
	static createFindManyQueryForTimePeriod(colToQuery: any, timePeriod: any, colId: number) {
		return new TimeAdjustedQueryFactory(async () => {
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

			const amountToSubtract: number | undefined = toSubtract[timePeriod];

			if (!amountToSubtract) {
				throw error(400, 'Provide a proper amount of time (week, month, year, ytd)');
			}

			const earliestPossibleDate = now.minus({ days: amountToSubtract });
			const data = await colToQuery.findMany({
				where: {
					columnId: colId,
					date: {
						gt: earliestPossibleDate.toJSDate()
					}
				},
				select: {
					date: true,
					value: true
				},
        orderBy: {
          date: "asc"
        }
			});
			return data;
		});
	}

	async execute() {
		return await this.callback();
	}
}
