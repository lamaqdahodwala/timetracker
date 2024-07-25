import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MoveDataToHistorical } from './moveDataToHistorical';
import { mockDeep, mockReset } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import type { RequestEvent } from '../$types';
import { DateTime } from 'luxon';
import { prisma } from '$lib/db';

describe('moveDataToHistorical', () => {
	const event = mockDeep<RequestEvent>();
	beforeEach(async () => {
		mockReset(event);
		await prisma.column.createMany({
			data: [
				{
					id: 1,
					name: 'Test Column',
					today: 40,
					lastUpdated: DateTime.now().minus({ days: 10 }).toJSDate()
				}
			]
		});
	});

	it('compiles', () => {
		expect(() => new MoveDataToHistorical(prisma, event)).not.toThrow();
	});

	it('can move data that is old', async () => {
		await new MoveDataToHistorical(prisma, event).call();
		const result = await prisma.row.findMany();

		expect(result).toHaveLength(1);
		expect(result[0].value).toEqual(40);
		expect(result[0].date).toBeTruthy();
	});

	it('resets the score after moving data', async () => {
		await new MoveDataToHistorical(prisma, event).call();

		const result = await prisma.column.findUnique({
			where: {
				id: 1
			}
		});

		expect(result?.today).toEqual(0);
	});

	it('has the same date as today after moving data', async () => {
		await new MoveDataToHistorical(prisma, event).call();

		const result = await prisma.column.findUnique({
			where: {
				id: 1
			}
		});

		const todays_date = DateTime.now();

		if (result?.today) {
			expect(DateTime.fromJSDate(result.today).hasSame(todays_date, 'day')).toBeTruthy();
		}
	});
});
