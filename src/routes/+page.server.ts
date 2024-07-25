import { authGuard } from '$lib/guards/AuthGuard';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { TodaysStats } from './api/getTodaysStats/GetTodaysStats';

export const load: PageServerLoad = async ({ fetch, locals, parent }) => {

	const res = await fetch('/api/getTodaysStats');
	const json: TodaysStats = await res.json();

	const scoreRes = await fetch('/api/calculateScore');
	const scoreJson = await scoreRes.json();


	return {
		todaysStats: json,
		score: scoreJson.score
	};
};
