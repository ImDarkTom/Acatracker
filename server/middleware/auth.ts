import { auth, UserWithId } from "~~/lib/auth";

const UNAUTHED_ONLY_ROUTES = ['/', '/sign-in', '/sign-up'];
const UNVERIFIED_EMAIL_ONLY_ROUTES = ['/verify-email']

export default defineEventHandler(async (event) => {
    const session = await auth.api.getSession({
        headers: event.headers,
    });

    event.context.user = session?.user as unknown as UserWithId;

    if (event.path.startsWith('/api/')) {
        return;
    }

    if (session?.user) {
        if (!session.user.emailVerified && !UNVERIFIED_EMAIL_ONLY_ROUTES.includes(event.path)) {
            await sendRedirect(event, '/verify-email', 302);
        } else if (UNAUTHED_ONLY_ROUTES.includes(event.path)) {
            await sendRedirect(event, '/dashboard', 302);
        }
    } else {
        // If we are attempting to access a user-exclusive page while unauthed, go back to home
        if (event.path.startsWith('/dashboard')) {
            await sendRedirect(event, '/', 302);
        }
    }
});