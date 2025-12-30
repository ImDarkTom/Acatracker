import db from "..";
import { and, eq } from "drizzle-orm";
import { module, InsertModule, type ModuleSchema } from "../schema";

export async function findModules(userId: number): Promise<ModuleSchema[]> {
    return db.query.module.findMany({
        where: eq(module.userId, userId),
    });
}

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