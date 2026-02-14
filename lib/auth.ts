import db from './db/index';
import { betterAuth, type User } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware } from "better-auth/plugins";
import env from './env';
import { calendarToken, userPreferences } from './db/schema';
import { resend } from './email/resend';

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
                    const userId = (createdUser as unknown as UserWithId).id;

                    // Create users' calendar token
                    await db.insert(calendarToken).values({ userId });
                    
                    // Create their default settings
                    await db.insert(userPreferences).values({ userId });
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
    },
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 8,
        requireEmailVerification: false,
    },
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        sendVerificationEmail: async({ user, url }) => {
            await resend.emails.send({
                from: 'Acatracker <verify@acatracker.app>',
                to: user.email,
                subject: 'Verify your Acatracker account',
                template: {
                    id: 'email-verification',
                    variables: {
                        URL: url,
                    }
                }
            });
        },
    },
    user: {
        deleteUser: {
            enabled: true,
        }
    }
});