import { APIResponseTestable } from '$lib/abstract/APIResponseTestable';
import type { PrismaClient, Row } from '@prisma/client';
import type { Column } from '@prisma/client';
import { max } from 'lodash-es';
import {
	AdditiveScoreCalculator,
	DivisiveScoreCalculator,
	MultiplicativeScoreCalculator,
	SubtractiveScoreCalculator
} from './ColumnScoreCalculator';

import type { ColumnScoreCalculator } from './ColumnScoreCalculator';
import { json } from '@sveltejs/kit';
import { AuthAPIResponse } from '$lib/abstract/AuthAPIResponse';
import type { User } from '@auth/sveltekit';

export class CalculateScore extends AuthAPIResponse {
	async onCall(prisma: PrismaClient, props: {user: User}) {
		const cols = await prisma.column.findMany({
      where: {
        userId: props.user.id
      },
			include: {
				historicalData: true
			}
		});

		let score = 0;

		cols.forEach((column) => {
			let calculator: ColumnScoreCalculator;
			switch (column.type) {
				case 'additive':
					calculator = new AdditiveScoreCalculator(column, column.historicalData);
					break;
				case 'subtractive':
					calculator = new SubtractiveScoreCalculator(column, column.historicalData);
					break;
				case 'multiplicative':
					calculator = new MultiplicativeScoreCalculator(column, column.historicalData);
					break;
				case 'divisive':
					calculator = new DivisiveScoreCalculator(column, column.historicalData);
					break;
				default:
					calculator = new AdditiveScoreCalculator(column, column.historicalData);
			}

			score = calculator.calculateChangeInScore(score);
		});

		return score;
	}

	async returnResponse(): Promise<Response> {
		return json({
			score: await this.call()
		});
	}
}
