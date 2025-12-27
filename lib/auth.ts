import db from './db/index';
import { betterAuth, type User } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware } from "better-auth/plugins";
import env from './env';
import { calendarToken } from './db/schema';

export type UserWithId = Omit<User, 'id'> & {
    id: number;
};

export const auth = betterAuth({
    hooks: {
        after: createAuthMiddleware(async (ctx) => {
            if (ctx.path === "/get-session") {
                if (!ctx.context.session) {
                    return ctx.json({
                        session: null,
                        user: null,
                    });
                }
                return ctx.json(ctx.context.session);
            }
        }),
    },
    database: drizzleAdapter(db, {
        provider: 'sqlite',
    }),
    databaseHooks: {
        user: {
            create: {
                after: async (createdUser) => {
                    await db.insert(calendarToken).values({
                        userId: (createdUser as unknown as UserWithId).id,
                    });
                }
            }
        }
    },
    advanced: {
        database: {
            generateId: false,
        },
    },
    socialProviders: {
        github: {
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET,
        }
    }
});