import type { APIResponseTestable } from '$lib/abstract/APIResponseTestable';
import type { Column, Row } from '@prisma/client';
import { max } from 'lodash-es';

export abstract class ColumnScoreCalculator {
	private column;
	private historical;

	constructor(column: Column, historical: Row[]) {
		this.column = column;
		this.historical = historical;
	}

	calculateChangeInScore(score) {
		if (!this.isPastThreshold()) return score;

		const func = this.adaptUserFunctionForStackability();

		return func(score);
	}

	// Assuming that there is no threshold, for an increase of 1 to the value of `today`, what should happen to the score?
	abstract getScoreImpactFunction(factor: number): (x: number) => number;

	getMaxHistoricalScore() {
		const historicalScores = this.historical.map((value) => value.value);
		let maximum = max(historicalScores);

		if (!maximum) maximum = 0;
		return maximum;
	}
	isPastThreshold() {
		if (this.column.threshold === -1) {
			const maximum = this.getMaxHistoricalScore();
			if (this.column.today > maximum) {
				return true;
			}
			return false;
		}

		if (this.column.today > this.column.threshold) return true;
		return false;
	}

	getDifferenceFromThreshold() {
		let threshold = 0;
		if (this.column.threshold === -1) {
			threshold = this.getMaxHistoricalScore();
		} else {
			threshold = this.column.threshold;
		}

		return this.column.today - threshold;
	}

	adaptUserFunctionForStackability(): (current: number) => number {
		const userFunc = this.getScoreImpactFunction(this.column.factor);
		if (this.column.stackable) {
			const difference = this.getDifferenceFromThreshold();
			return (curr: number) => {
				for (let index = 0; index < difference; index++) {
					curr = userFunc(curr);
				}
				return curr;
			};
		}

		return (current: number) => userFunc(current);
	}
}

export class SubtractiveScoreCalculator extends ColumnScoreCalculator {
	getScoreImpactFunction(factor: number): (x: number) => number {
		return (number) => number - factor;
	}
}
export class MultiplicativeScoreCalculator extends ColumnScoreCalculator {
	getScoreImpactFunction(factor: number): (x: number) => number {
		return (number) => number * (factor + 1);
	}
}
export class DivisiveScoreCalculator extends ColumnScoreCalculator {
	getScoreImpactFunction(factor: number): (x: number) => number {
		return (number) => Math.floor(number / (factor + 1));
	}
}
export class AdditiveScoreCalculator extends ColumnScoreCalculator {
	getScoreImpactFunction(factor: number): (x: number) => number {
		return (number) => number + factor;
	}
}
