import { beforeEach, describe, expect, test, vi } from 'vitest';
import { GetTodaysStats } from './GetTodaysStats';
import { mockDeep, mockReset } from 'vitest-mock-extended';
import { PrismaClient } from '@prisma/client';
import type { RequestEvent } from './$types';

describe('GetTodaysStats', () => {
	const prisma = mockDeep<PrismaClient>();
	const event = mockDeep<RequestEvent>();
	beforeEach(() => {
		mockReset(prisma);
		mockReset(event);
	});

	const fake_columns = [
		{
			name: 'Yessir',
			today: 23,
			id: 1,
			lastUpdated: new Date()
		},
		{
			name: 'Howdy',
			today: 48392,
			id: 2,
			lastUpdated: new Date()
		}
	];
	test('returns columns that are in the database', async () => {
		const stats = new GetTodaysStats(prisma, event);

		prisma.column.findMany.mockResolvedValue(fake_columns);

		expect(stats.call()).resolves.toEqual({
			columns: fake_columns
		});
	});
});
