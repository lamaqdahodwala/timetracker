import { sequence } from '@sveltejs/kit/hooks';
import { handle as authentication } from './auth';
import { redirect, type Handle } from '@sveltejs/kit';

const authorizationHandle: Handle = async ({ event, resolve }) => {
	if ((event.url.pathname === '/')) {
		if ((await event.locals.auth()) === null) {
      throw redirect(301, "/splash")
		}
	}

  if (event.url.pathname === "/signin" && ( await event.locals.auth() !== null)){
    throw redirect(301, "/")
  }
	return await resolve(event);
};

export const handle = sequence(authentication, authorizationHandle);
