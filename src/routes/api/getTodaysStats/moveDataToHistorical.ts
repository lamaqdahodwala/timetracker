import { APIResponseTestable } from '$lib/abstract/APIResponseTestable';
import { CalculateScore } from '../calculateScore/CalculateScore';
import { AuthAPIResponse } from '$lib/abstract/AuthAPIResponse';
import type { User } from '@auth/sveltekit';
import type { PrismaClient, Prisma } from '@prisma/client';
import type { DefaultArgs } from '@prisma/client/runtime/library';
import { error, type RequestEvent } from '@sveltejs/kit';
import { DateTime } from 'luxon';

export class MoveDataToHistorical extends AuthAPIResponse {
	async onCall(
		prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
		props: { user: User; calculator: CalculateScore }
	) {
		const cols = await prisma.column.findMany({
			where: {
				user: {
					id: props.user.id
				}
			}
		});

		let userScore: number = await props.calculator.call();

    let userTimezone = await prisma.user.findUnique({
      where: {
        id: props.user.id
      }, 
      select: {
        timezone: true
      }
    })

    if (!userTimezone || !userTimezone.timezone) throw error(500)

		// if the column was last updated yesterday (or before), move it into the historical data section
		let hasCreatedScoreRow = false;
		for (let index = 0; index < cols.length; index++) {
			const element = cols[index];

			if (this.isColumnLastUpdatedBeforeToday(element.lastUpdated, userTimezone.timezone)) {
				if (!hasCreatedScoreRow) {
					await prisma.scoreRow.create({
						data: {
							userId: String(props.user.id),
							date: cols[0].lastUpdated,
							value: userScore
						}
					});
					hasCreatedScoreRow = true;
				}
				await prisma.row.create({
					data: {
						column: {
							connect: {
								id: element.id
							}
						},
						value: element.today,
						date: element.lastUpdated
					}
				});

				console.log('Created row');

				await prisma.column.update({
					where: {
						id: element.id
					},
					data: {
						today: 0
					}
				});
			}
		}

		return {
			success: true
		};
	}

	getProps(event: RequestEvent<Partial<Record<string, string>>, string | null>) {
		return {
			calculator: new CalculateScore(this.prisma, event)
		};
	}

	isColumnLastUpdatedBeforeToday(lastUpdated: Date, userTimezone: string): boolean {
		const lastUpdatedDate = DateTime.fromJSDate(lastUpdated);
    console.log(lastUpdatedDate)

    if (!userTimezone) {
      userTimezone = "UTC"
    }

		let sameDay =  !lastUpdatedDate.hasSame(DateTime.now().setZone(userTimezone), 'day');
    return sameDay
	}
}
