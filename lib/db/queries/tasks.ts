import db from "..";
import { and, eq } from "drizzle-orm";
import { InsertTask, task, type TaskSchema } from "../schema";

export async function findTasks(userId: number): Promise<TaskSchema[]> {
    return db.query.task.findMany({
        where: eq(task.userId, userId),
    });
}

export async function insertTask(
    insertable: InsertTask, 
    userId: number
): Promise<TaskSchema | undefined> {
    const [ created ] = await db.insert(task).values({
        ...insertable,
        userId,
    }).returning();

    return created;
}


export async function deleteTaskById(
    id: number, 
    userId: number
): Promise<TaskSchema | undefined> {
    const [ removed ] = await db.delete(task).where(
        and(
            eq(task.id, id),
            eq(task.userId, userId),
        ),
    ).returning();

    return removed;
}

export async function updateTaskById(
    id: number, 
    newTask: Partial<InsertTask>, 
    userId: number
): Promise<TaskSchema | undefined> {
    const [ updated ] = await db.update(task)
        .set(newTask)
        .where(
            and(
                eq(task.id, id),
                eq(task.userId, userId),
            ),  
        ).returning();

    return updated;
}