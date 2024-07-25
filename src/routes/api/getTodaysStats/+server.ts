import { APIResponseTestable } from '$lib/abstract/APIResponseTestable';
import { prisma } from '$lib/db';
import type { PrismaClient, Prisma } from '@prisma/client';
import type { DefaultArgs } from '@prisma/client/runtime/library';
import { json } from '@sveltejs/kit';
import type { RequestEvent, RequestHandler } from '@sveltejs/kit';
import { DateTime } from 'luxon';
import { MoveDataToHistorical } from './moveDataToHistorical';
import { GetTodaysStats } from './GetTodaysStats';

// export const GET: RequestHandler = async () => {
//   let stats = await prisma.row.findMany({
//     where: {
//       date: DateTime.now().toLocaleString(DateTime.DATE_SHORT)
//     },
//     take: 1
//   })
//
//   if (stats.length === 0){
//     let new_stats = await prisma.row.create({
//       data: {
//         date: DateTime.now().toLocaleString(DateTime.DATE_SHORT)
//       }
//     })
//
//     return json(new_stats)
//   }
//
//   return json( stats[0] )
// }
//
//
export const GET: RequestHandler = async (event) => {
	await new MoveDataToHistorical(prisma, event).call();
	return await new GetTodaysStats(prisma, event).returnResponse();
};
