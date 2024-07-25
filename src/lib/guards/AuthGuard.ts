import { redirect, type RequestEvent } from '@sveltejs/kit';
import { WhoAmI } from '../../routes/api/whoAmI/WhoAmI';
import { prisma } from '$lib/db';

class FrontendAuthGuard {
	redirectUrl: string;
	whoAmIUrl: string;

	constructor(redirect: string = '/signin', whoAmIUrl: string = '/api/whoAmI') {
		this.redirectUrl = redirect;
		this.whoAmIUrl = whoAmIUrl;
	}

	async protectOrRedirect(fetchFunc: any) {
		const res = await fetchFunc(this.whoAmIUrl, {
			cache: 'no-cache'
		});
		const json = await res.json();

		const user = json.user;

		if (user === null) {
			throw redirect(301, this.redirectUrl);
		}
	}
}

export const authGuard = new FrontendAuthGuard('/signin', '/api/whoAmI');
export const authGuardToSplash = new FrontendAuthGuard('/splash');
