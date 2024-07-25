import { PrismaClient } from '@prisma/client';
import { beforeEach, describe, expect, test } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';
import type { RequestEvent } from './$types';
import { CreateColumn } from './CreateColumn';

describe('CreateColumn', () => {
	const prisma = mockDeep<PrismaClient>();
	const event = mockDeep<RequestEvent>();

	beforeEach(() => {
		mockReset(prisma);
		mockReset(event);
	});

	test('creates a column given the name', async () => {
		event.request.json.mockResolvedValue({
			colName: 'Minutes'
		});

		prisma.column.create.mockImplementation(async (args) => ({
			name: args.data.name,
			today: args.data.today,
			id: 1
		}));

		expect(new CreateColumn(prisma, event).call()).resolves.toEqual({
			id: 1,
			name: 'Minutes',
			today: 0
		});
	});
});
