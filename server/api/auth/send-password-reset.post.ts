import z from "zod";
import { auth } from "~~/lib/auth";

export default defineEventHandler(async (event) => {
    const body = await validateBody(event, z.object({ email: z.email('Enter a valid email.') }));

    try {
        await auth.api.requestPasswordReset({
            body: {
                email: body.email,
                redirectTo: '/auth/reset-password'
            }
        });
    } catch (e) {
        throw createError({
            statusCode: 500,
            statusMessage: "Error sending verification email. Please try again later."
        });
    }

    setResponseStatus(event, 204); // No Content
});