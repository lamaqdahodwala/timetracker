import { error, type RequestEvent } from '@sveltejs/kit';
import { APIResponseTestable } from './APIResponseTestable';

export abstract class AuthAPIResponse extends APIResponseTestable {
	async call(): Promise<any> {
		const auth = await this.event.locals.auth();

		if (!auth) {
			return await this.notAuthenticated();
		}

		return await this.onCall(this.prisma, {
			...(await this.getProps(this.event)),
			user: auth?.user
		});
	}

	async notAuthenticated(): Promise<any> {
		throw error(403, 'Unauthenticated. Please log in');
	}
}
