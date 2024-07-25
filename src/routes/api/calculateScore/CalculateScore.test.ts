import { PrismaClient } from '@prisma/client';
import { beforeEach, describe, expect, test } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';
import type { RequestEvent } from './$types';
import { prisma } from '$lib/db';
import { CalculateScore } from './CalculateScore';

describe('CreateColumn', () => {
	const event = mockDeep<RequestEvent>();

	beforeEach(async () => {
		mockReset(event);
		await prisma.$transaction([prisma.column.deleteMany(), prisma.row.deleteMany()]);
	});

	test('calculate a score with additive columns', async () => {
		await prisma.column.createMany({
			data: [
				{
					name: 'Col1',
					today: 2,
					type: 'additive'
				},
				{
					name: 'Col2',
					today: 58,
					type: 'additive'
				},
				{
					name: 'Col3',
					today: 10,
					type: 'additive'
				}
			]
		});

		expect(await new CalculateScore(prisma, event).call()).toEqual(3);
	});
	test('calculate a score with subtractive columns', async () => {
		await prisma.column.createMany({
			data: [
				{
					name: 'Col1',
					today: 2,
					type: 'subtractive'
				},
				{
					name: 'Col2',
					today: 58,
					type: 'subtractive'
				},
				{
					name: 'Col3',
					today: 10,
					type: 'subtractive'
				}
			]
		});

		expect(await new CalculateScore(prisma, event).call()).toEqual(-3);
	});

	test('calculate a score with multiplicative columns', async () => {
		await prisma.column.createMany({
			data: [
				{
					name: 'Col1',
					today: 2,
					type: 'multiplicative'
				},
				{
					name: 'Col2',
					today: 58,
					type: 'multiplicative'
				},
				{
					name: 'Col3',
					today: 10,
					type: 'multiplicative'
				}
			]
		});

		expect(await new CalculateScore(prisma, event).call()).toEqual(0);
	});

	test('calculate a score with divisive columns', async () => {
		await prisma.column.createMany({
			data: [
				{
					name: 'Col1',
					today: 2,
					type: 'divisive'
				},
				{
					name: 'Col2',
					today: 58,
					type: 'divisive'
				},
				{
					name: 'Col3',
					today: 10,
					type: 'divisive'
				}
			]
		});

		const score = await new CalculateScore(prisma, event).call();
		expect(score == 0).toBeTruthy();
	});
	test('calculate a score with a different threshold', async () => {
		await prisma.column.createMany({
			data: [
				{
					name: 'Col1',
					today: 2,
					type: 'additive'
				},
				{
					name: 'Col2',
					today: 58,
					type: 'additive',
					threshold: 60
				},
				{
					name: 'Col3',
					today: 10,
					type: 'additive'
				}
			]
		});

		expect(await new CalculateScore(prisma, event).call()).toEqual(2);
	});
	test('calculate a score with a PB threshold', async () => {
		await prisma.column.createMany({
			data: [
				{
					name: 'Col1',
					today: 2,
					type: 'additive',
					id: 1
				},
				{
					name: 'Col2',
					today: 58,
					type: 'additive',
					threshold: -1,
					id: 2
				},
				{
					name: 'Col3',
					today: 10,
					id: 3,
					type: 'additive'
				}
			]
		});

		await prisma.row.create({
			data: {
				value: 60,
				date: 'Yes',
				column: {
					connect: {
						id: 2
					}
				}
			}
		});

		expect(await new CalculateScore(prisma, event).call()).toEqual(2);
	});

	test('calculate a score with a different factor', async () => {
		await prisma.column.createMany({
			data: [
				{
					name: 'Col1',
					today: 2,
					type: 'additive',
					factor: 5
				},
				{
					name: 'Col2',
					today: 58,
					type: 'additive',
					factor: 10
				},
				{
					name: 'Col3',
					today: 10,
					type: 'additive',
					factor: 15
				}
			]
		});

		expect(await new CalculateScore(prisma, event).call()).toEqual(30);
	});
	test('calculate a score with a stackable column', async () => {
		await prisma.column.createMany({
			data: [
				{
					name: 'Col1',
					today: 2,
					type: 'additive'
				},
				{
					name: 'Col2',
					today: 58,
					type: 'additive'
				},
				{
					name: 'Col3',
					today: 10,
					type: 'additive',
					stackable: true
				}
			]
		});

		expect(await new CalculateScore(prisma, event).call()).toBe(12);
	});
	test('calculates a score with different kinds of columns', async () => {
		await prisma.column.createMany({
			data: [
				{
					name: 'Col1',
					today: 2,
					type: 'additive'
				},
				{
					name: 'Col2',
					today: 58,
					type: 'subtractive'
				},
				{
					name: 'Col3',
					today: 10,
					type: 'additive',
					stackable: true
				},
				{
					name: 'Col4',
					today: 5,
					type: 'multiplicative',
					threshold: -1,
					factor: 2,
					id: 7
				},
				{
					name: 'Col5',
					today: 5,
					type: 'multiplicative',
					threshold: 3,
					factor: 2
				},
				{
					name: 'Col6',
					today: 10,
					threshold: 10,
					type: 'divisive',
					factor: 20
				},
				{
					name: 'Col7',
					today: 10,
					type: 'divisive'
				},
				{
					name: 'Col8',
					today: 10,
					type: 'multiplicative',
					threshold: 8,
					stackable: true
				}
			]
		});

		await prisma.row.create({
			data: {
				date: 'date',
				value: 10,
				columnId: 7
			}
		});
		expect(await new CalculateScore(prisma, event).call()).toEqual(60);
	}),
		test('returns 0 if there are no columns', async () => {
			expect(await new CalculateScore(prisma, event).call()).toBe(0);
		});
});
