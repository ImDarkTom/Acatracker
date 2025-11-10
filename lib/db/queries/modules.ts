import db from "..";
import { eq } from "drizzle-orm";
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