#### SPRINT DUE - 6/7/24

#### SPRINT COMPLETED: 6/4/24

# Current Sprint: User Authentication

Have user authentication to allow people other than me to use the site and have data tailored to them. This provides security and privacy, as well as the ability to customize your own system.

#### Objectives

- [x] Add an auth provider like Auth.js or similar
- [x] Extend the current APIResponseTestable abstract class to allow for authentication per route
- [x] Add login and signin pages, as well as a protected route on the main page to ensure that users are signed in
- [x] Update existing API routes to use authentication where needed
- [x] Add an API route that returns the current user, to be used for front-end checking if you are signed in

Design Reasoning:

1. Use of an Auth Guard

   - Authorization is a key part of any app. Ideally, authorizations hould be as simple as a single line of code that can protect a route. To that end, I have created the FrontendAuthGuard in $lib/guards. This auth guard is specifically designed for the Frontend (unlike AuthAPIResponse), and can be used on +page.ts files. AuthAPIResponse is to protect the backend, and this is to protect the frontend. I decided to use a guard system instead of what the Auth.js docs recommended, which was to add protection using manual checking from +page.server.ts. However, they provided serious warnings about where I should get the authentication state and whether or not +layout.server.ts will refetch or not, and so many other complications. Instead of this, I decided to create a simple guard that will call the api route /api/whoAmI and check for authentntication state that way. If the user isn't signed in, then they will be redirected to the sign in page. While this method is straightforward and easy to understand, it is also inefficient because each call to a protected route needs to go through the /whoAmI endpoint, which could potentially be a bottleneck in production and cause strain on the server from simply navigating too fast. However, I overcame this issue by attempting to design my app almost like a SPA, with a single page dedicated to everything. This means that the guard really only has to run once: when the user first navigates to the page. Therefore, this isn't that big an issue.

2. AuthAPIResponse
   - The authorization scheme on the frontend has been covered, but what about on the backend? My answer to this question is the AuthAPIResponse class. It is an abstract class that inherits from APIResponseTestable. In keeping with the SOLID principles, I designed this class with Liskov Substitution in mind; the class is completely replaceable with APIResponseTestable, as it doesn't overwrite any methods or change how the class is used. By using AuthAPIResponse, you add a `user` field to your props by default. This field contains all relevant info about the user, like username and ID. The class also implements a guard of its own, and provides a method that I can override to control what happens if the user isn't signed out. However, this guard is a lot less computationally expensive because it simply uses event.locals.auth(), data that the Auth.js hook is already setting for this purpose. There's no need for fetching other API routes because the data is already here.
