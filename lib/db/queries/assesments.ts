import db from "..";
import { and, eq } from "drizzle-orm";
import { assesment, InsertAssesment, type AssesmentSchema } from "../schema";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvqxyz", 5);

export async function findAssesments(userId: number) {
    return db.query.assesment.findMany({
        where: eq(assesment.userId, userId),
    });
}

export async function findAssesmentBySlug(slug: string) {
    return db.query.assesment.findFirst({
        where: eq(assesment.slug, slug),
    });
}

export async function findUniqueSlug(slug: string): Promise<string> {
    // TODO: optimise this by getting all slugs beginning with the name, so we don't have to re-query
    let existing = !!(await findAssesmentBySlug(slug));

    while (existing) {
        const id = nanoid();
        const idSlug = `${slug}-${id}`;

        existing = !!(await findAssesmentBySlug(idSlug));

        if (!existing) {
            return idSlug;
        }
    }

    return slug;
}

export async function insertAssesment(insertable: InsertAssesment, slug: string, userId: number) {
    const [ created ] = await db.insert(assesment).values({
        ...insertable,
        slug,
        userId,
    }).returning();

    return created;
}

export async function deleteAssesmentById(id: number, userId: number) {
    const [ removed ] = await db.delete(assesment).where(
        and(
            eq(assesment.id, id),
            eq(assesment.userId, userId),
        ),
    ).returning();

    return removed;
}

export async function updateAssesmentById(id: number, newAssesment: InsertAssesment, userId: number) {
    const [ updated ] = await db.update(assesment)
        .set(newAssesment)
        .where(
            and(
                eq(assesment.id, id),
                eq(assesment.userId, userId),
            ),  
        ).returning();

    return updated;
}