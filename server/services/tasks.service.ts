import { InsertTask } from "~~/lib/db/schema";
import { TasksRepository } from "../repositories";

// Create
export async function insertTask(insertable: InsertTask, userId: number) {
    const created = await TasksRepository.insertTask(insertable, userId);
    if (!created) {
        console.error('Error inserting task', insertable, userId);

        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
        });
    }

    return created;
}

// Read
export async function findTasks(userId: number) {
    const tasks = await TasksRepository.findTasks(userId);
    return tasks;
}

// Update
export async function updateTaskById(id: number, newTask: Partial<InsertTask>, userId: number) {
    const updated = TasksRepository.updateTaskById(id, newTask, userId);
    if (!updated) throw createError({
        statusCode: 404,
        statusMessage: 'Task not found.'
    });

    return updated;
}

// Delete
export async function deleteTaskById(id: number, userId: number) {
    const deleted = TasksRepository.deleteTaskById(id, userId);
    if (!deleted) throw createError({
        statusCode: 404,
        statusMessage: 'Task not found.'
    });

    return deleted;
}
