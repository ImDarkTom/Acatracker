import { and, eq } from "drizzle-orm";
import db from "~~/lib/db";
import { InsertModule, module, ModuleSchema } from "~~/lib/db/schema";

// Create
export async function insertModule(
    insertable: InsertModule, 
    userId: number
): Promise<ModuleSchema | undefined> {
    const [ created ] = await db.insert(module).values({
        ...insertable,
        userId,
    }).returning();

    return created;
}

// Read
export async function findModules(userId: number): Promise<ModuleSchema[]> {
    return db.query.module.findMany({
        where: eq(module.userId, userId),
    });
}

export async function getModuleWithDetailedAssessments(userId: number, year: number, semester: number) {
    return db.query.module.findMany({
        where: and(
            eq(module.userId, userId),
            eq(module.year, year),
            eq(module.semester, semester),
        ),
        columns: {
            id: true,
            code: true,
            name: true,
            semester: true,
            year: true,
            createdAt: true,
            updatedAt: true,
        },
        with: {
            assessments: {
                columns: {
                    id: true,
                    slug: true,
                    name: true,
                    description: true,
                    releasedAt: true,
                    dueAt: true,
                    isCompleted: true,
                    createdAt: true,
                    updatedAt: true,
                    moduleId: true,
                },
                with: {
                    tasks: {
                        columns: {
                            id: true,
                            name: true,
                            description: true,
                            dueAt: true,
                            isCompleted: true,
                            createdAt: true,
                            updatedAt: true,
                        }
                    }
                }
            }
        }
    });
}

// Update
export async function updateModuleById(
    id: number, 
    newModule: InsertModule, 
    userId: number
): Promise<ModuleSchema | undefined> {
    const [ updated ] = await db.update(module)
        .set(newModule)
        .where(
            and(
                eq(module.id, id),
                eq(module.userId, userId),
            ),  
        ).returning();

    return updated;
}

// Delete
export async function deleteModuleById(
    id: number, 
    userId: number
): Promise<ModuleSchema | undefined> {
    const [ removed ] = await db.delete(module).where(
        and(
            eq(module.id, id),
            eq(module.userId, userId),
        ),
    ).returning();

    return removed;
}
