import { auth, UserWithId } from "~~/lib/auth";

export default defineEventHandler(async (event) => {
    const session = await auth.api.getSession({
        headers: event.headers,
    });

    event.context.user = session?.user as unknown as UserWithId;

    if (session?.user) {
        if (event.path === '/') {
            await sendRedirect(event, '/dashboard', 302);
        }
    } else {
        if (event.path.startsWith('/dashboard')) {
            await sendRedirect(event, '/', 302);
        }
    }
});