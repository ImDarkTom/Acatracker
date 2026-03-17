import { and, eq } from "drizzle-orm";
import db from "~~/lib/db";
import { assessment, AssessmentSchema, InsertAssessment } from "~~/lib/db/schema";

// Create
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

// Read
export async function findAssessments(userId: number): Promise<AssessmentSchema[]> {
    return await db.query.assessment.findMany({
        where: eq(assessment.userId, userId),
    });
}

export async function findAssessmentBySlug(slug: string): Promise<AssessmentSchema | undefined> {
    return await db.query.assessment.findFirst({
        where: eq(assessment.slug, slug),
    });
}

export async function getAssessmentWithTasks(
    slug: string,
    userId: number,
) {
    return await db.query.assessment.findFirst({
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

// Update
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

// Delete
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