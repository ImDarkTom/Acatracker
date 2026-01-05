import z from "zod";
import { auth } from "~~/lib/auth";
import { doesUnverifiedUserExist } from "~~/lib/db/queries/auth";

const rateLimitStore = new Map<string, number>();

export default defineEventHandler(async (event) => {
    const { email } = await validateBody(event, z.object({
        email: z.string()
    }));

    if (!(await doesUnverifiedUserExist(email))) {
        return sendError(event, createError({
            statusCode: 404,
            statusMessage: "User not found."
        }));
    }

    const now = Date.now();
    const lastSent = rateLimitStore.get(email);

    if (lastSent && now - lastSent < 30000) {
        return sendError(event, createError({
            statusCode: 429,
            statusMessage: "Please wait 30 seconds before retrying."
        }));
    }

    await auth.api.sendVerificationEmail({
        body: {
            email,
            callbackURL: '/'
        }
    });

    rateLimitStore.set(email, now);
    
    if (rateLimitStore.size > 1000) {
        const oldEntries = Array.from(rateLimitStore.entries())
            .filter(([_, time]) => now - time > 60000);

        oldEntries.forEach(([key]) => rateLimitStore.delete(key));
    }

    return { message: 'Verification email sent.' }
});