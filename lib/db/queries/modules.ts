import db from "..";
import { and, eq } from "drizzle-orm";
import { module, InsertModule } from "../schema";

export async function findModules(userId: number) {
    return db.query.module.findMany({
        where: eq(module.userId, userId),
    });
}

export async function insertModule(insertable: InsertModule, userId: number) {
    const [ created ] = await db.insert(module).values({
        ...insertable,
        userId,
    }).returning();

    return created;
}


export async function deleteModuleById(id: number, userId: number) {
    const [ removed ] = await db.delete(module).where(
        and(
            eq(module.id, id),
            eq(module.userId, userId),
        ),
    ).returning();

    return removed;
}

export async function updateModuleById(id: number, newModule: InsertModule, userId: number) {
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