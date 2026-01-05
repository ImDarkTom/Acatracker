import { and, eq } from 'drizzle-orm';
import db from '..';
import { user } from '../schema';

export async function doesUnverifiedUserExist(email: string) {
    return db.query.user.findFirst({
        where: and(
            eq(user.email, email),
            eq(user.emailVerified, false)
        ),
    });
}
