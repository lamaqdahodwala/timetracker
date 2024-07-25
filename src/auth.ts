import { SvelteKitAuth } from '@auth/sveltekit';
import { PrismaAdapter } from '@auth/prisma-adapter';
import Google from '@auth/sveltekit/providers/google';
import { prisma } from '$lib/db';

export const { handle, signIn, signOut } = SvelteKitAuth(async (event) => {
	const authOptions = {
		providers: [
			Google({
				clientId: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET
			})
		],
		secret: process.env.AUTH_SECRET,
		trustHost: true,
		adapter: PrismaAdapter(prisma),
		callbacks: {
			session({ session, user }) {
				session.user.id = user.id;
				return session;
			}
		}
	};
	return authOptions;
});
