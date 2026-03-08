import db from "..";
import { and, eq } from "drizzle-orm";
import { assessment, InsertAssessment, type AssessmentSchema } from "../schema";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("1234567890abcdefghijklmnopqrstuvqxyz", 5);

export async function findAssessments(userId: number): Promise<AssessmentSchema[]> {
    return db.query.assessment.findMany({
        where: eq(assessment.userId, userId),
    });
}

export async function findAssessmentBySlug(slug: string): Promise<AssessmentSchema | undefined> {
    return db.query.assessment.findFirst({
        where: eq(assessment.slug, slug),
    });
}

export async function findUniqueSlug(slug: string): Promise<string> {
    // TODO: optimise this by getting all slugs beginning with the name, so we don't have to re-query
    let existing = !!(await findAssessmentBySlug(slug));

    while (existing) {
        const id = nanoid();
        const idSlug = `${slug}-${id}`;

        existing = !!(await findAssessmentBySlug(idSlug));

        if (!existing) {
            return idSlug;
        }
    }

    return slug;
}

export async function insertAssessment(
    insertable: InsertAssessment, 
    slug: string, 
    userId: number
): Promise<AssessmentSchema | undefined> {
    const [ created ] = await db.insert(assessment).values({
        ...insertable,
        slug,
        userId,
    }).returning();

    return created;
}

export async function deleteAssessmentBySlug(
    slug: string, 
    userId: number
): Promise<AssessmentSchema | undefined> {
    const [ removed ] = await db.delete(assessment).where(
        and(
            eq(assessment.slug, slug),
            eq(assessment.userId, userId),
        ),
    ).returning();

    return removed;
}

export async function updateAssessmentBySlug(
    slug: string, 
    newAssessment: Partial<InsertAssessment>, 
    userId: number
): Promise<AssessmentSchema | undefined> {
    const [ updated ] = await db.update(assessment)
        .set(newAssessment)
        .where(
            and(
                eq(assessment.slug, slug),
                eq(assessment.userId, userId),
            ),  
        ).returning();

    return updated;
}

export async function getAssessmentWithTasks(
    slug: string,
    userId: number,
) {
    return db.query.assessment.findFirst({
        where: and(
            eq(assessment.slug, slug),
            eq(assessment.userId, userId),
        ),
        with: {
            module: {
                columns: {
                    id: true,
                    name: true,
                    code: true,
                    semester: true,
                    year: true,
                },
            },
            tasks: {
                columns: {
                    id: true,
                    name: true,
                    description: true,
                    dueAt: true,
                    isCompleted: true,
                },
            },
        }
    });
}

export type AssessmentWithDetails = NonNullable<Awaited<ReturnType<typeof getAssessmentWithTasks>>>