import { auth } from "~~/lib/auth";

const rateLimitStore = new Map<string, number>();

export default defineAuthenticatedEventHandler(async (event) => {
    const user = event.context.user;

    if (user.emailVerified) {
        return sendError(event, createError({
            statusCode: 400,
            statusMessage: "Email is already verified."
        }));
    }

    const email = user.email;

    const now = Date.now();
    const lastSent = rateLimitStore.get(email);
    
    if (lastSent && now - lastSent < 30000) {
        const timeAfterLastSentMs = now - lastSent;
        const timeoutLeft = 30 - Math.round(timeAfterLastSentMs/1000);

        return sendError(event, createError({
            statusCode: 429,
            statusMessage: `Please wait ${timeoutLeft} seconds before retrying.`,
            data: { timeoutLeft }
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