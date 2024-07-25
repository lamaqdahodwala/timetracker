import { beforeEach } from 'vitest';
import { prisma } from '$lib/db';
beforeEach(async () => {
	await prisma.$transaction([prisma.row.deleteMany(), prisma.column.deleteMany()]);
});
