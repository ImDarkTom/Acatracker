import { auth, UserWithId } from "~~/lib/auth";

const UNAUTHED_ONLY_ROUTES = ['/', '/auth/sign-in', '/auth/sign-up'];
const UNVERIFIED_EMAIL_ONLY_ROUTES = ['/auth/verify-email'];

export default defineEventHandler(async (event) => {
    const session = await auth.api.getSession({
        headers: event.headers,
    });

    event.context.user = session?.user as unknown as UserWithId;

    if (event.path.startsWith('/api/')) {
        return;
    }

    const user = session?.user;

    if (user) {
        // Redirect unverified users to email verification page
        if (!user.emailVerified && !UNVERIFIED_EMAIL_ONLY_ROUTES.includes(event.path)) {
            return sendRedirect(event, '/auth/verify-email', 302);
        } 
        
        // Redirect authorized users away from auth pages
        if (UNAUTHED_ONLY_ROUTES.includes(event.path)) {
            return sendRedirect(event, '/dashboard', 302);
        }
    } else {
        // Redirect unauthed users away from protected pages
        if (event.path.startsWith('/dashboard') || UNVERIFIED_EMAIL_ONLY_ROUTES.includes(event.path)) {
            return sendRedirect(event, '/', 302);
        }
    }
});
