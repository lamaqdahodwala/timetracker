import { AuthAPIResponse } from '$lib/abstract/AuthAPIResponse';
import type { PrismaClient, Prisma } from '@prisma/client';
import type { DefaultArgs } from '@prisma/client/runtime/library';
import { error, type RequestEvent } from '@sveltejs/kit';
import type { GetHistoricalData } from '../getHistoricalData/[id]/GetHistoricalData';
import type { User } from '@auth/sveltekit';
import { DateTime, Duration } from 'luxon';
export class GetTargetInfo extends AuthAPIResponse {
	async onCall(
		prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
		props: { columnId: string; getHistorical: GetHistoricalData; user: User }
	) {
		let column = await prisma.column.findUnique({
			where: {
				id: Number(props.columnId)
			},
			include: {
				target: true
			}
		});

		if (!column) throw error(404, 'No column found');

		let target = column.target;

		if (!target) return { targetString: null };

		if (target.length === 'day') {
			return { targetString: `${column.today}/${target.targetValue} today` };
		}

		let setOnDate = DateTime.fromJSDate(target.setOn);
		let goalLength: Duration;
		let maxDate: DateTime;

		if (target.length === 'week') goalLength = Duration.fromObject({ weeks: 1 });
		else goalLength = Duration.fromObject({ months: 1 });

    maxDate = setOnDate.plus(goalLength)

		let now = DateTime.now();

		while (now > maxDate) {
			setOnDate = maxDate
      maxDate = setOnDate.plus(goalLength)
		}

    await prisma.target.update({
      where: {
        columnId: Number( props.columnId )
      },
      data: {
        setOn: setOnDate.toJSDate()
      }
    })

		let rows = await prisma.row.findMany({
			where: {
				columnId: column.id,
				date: {
					gte: setOnDate.toJSDate(),
					lt: maxDate?.toJSDate()
				}
			}
		});

		let total = 0;
		rows.forEach((row) => (total += row.value));
		total += column.today;

		return { targetString: `${total}/${target.targetValue} this ${target.length}`, isOverTarget: total >= target.targetValue};
	}

	async getProps(event: RequestEvent<Partial<Record<string, string>>, string | null>) {
		let json: URLSearchParams = event.url.searchParams;

		let columnId = json.get('columnId');

		if (!columnId) throw error(400, 'Provide a column ID');

		return {
			columnId
		};
	}
}
