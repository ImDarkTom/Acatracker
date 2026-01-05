# Backend Tech

This file contains information about the backend tech used.


## Drizzle ORM

**Drizzle ORM** is used to interact with the turso SQLite database.

Relevant files:
- `lib/db/`: Contains all DB-related code.
- `lib/db/migrations`: Contains migrations that need to be applied after creating an empty DB by running `bun drizzle-kit migrate`.
- `lib/db/schema`: Contains user-created DB schemas, except for `lib/db/schema/auth.ts` which is generated automatically by Better Auth and should not be modified. For adding additional fields to users, see [here](https://better-auth-ui.com/advanced/additional-fields).
- `lib/db/queries`: Contains query functions for parts of the app backend. Do not write queries outside this folder, instead create a query inside here and use it elsewhere.
- `lib/db/index.ts`: Contains the Drizzle instance & settings.


## Turso

**Turso** is used as the primary database.

In development, use the [Turso CLI](https://docs.turso.tech/cli/installation) to have a local SQLite instance accessible via localhost.

In production, use a hosted Turso instance.


## Better Auth

**Better Auth** is used for authentication and session management. It connects to the Drizzle database via the Better Auth config.

Relevant files:
- `lib/auth`: Contains the Better Auth instance and config. Used on the server.
- `app/stores/authStore`: Client-side usage.


## Resend

**Resend** is used for sending emails for user email verification. 

Relevant files:
- `lib/email/resend`: Resend instance.
- `lib/auth`: Contains the email sent for email verification. A template with id `email-verification` is used with the variable `URL`.
- `server/api/auth/resend-verification.post.ts`: If the user wants to resend the verification email in case they didn't receive one/are attempting to login without being verified. A page on the frontend is opened and a request is sent here. It has a 30s cooldown.


## ical-generator

**ical-generator** is used to generate an ICal calendar on the sever which is then given to the user, allowing them to see their events in external calendars that support ICal format.

Relevant files:
- `sever/events/[token].get.ts`: The route used to get the user's events in ICal. A unique token is assigned to the user at time of account creation which is used to determine their unique URL. A token is preferred as an ID can be easily guessed since user IDs are in numerical order.
- `server/utils/events.ts`: The business logic for formatting the user's events into ICal format.