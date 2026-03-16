import { InsertModule } from "~~/lib/db/schema";
import { UserService } from ".";
import { ModulesRepository } from "../repositories";

// Create
export async function createModule(data: InsertModule, userId: number) {
    const inserted = await ModulesRepository.insertModule(data, userId);
    if (!inserted) throw createError({
        statusCode: 500,
        statusMessage: 'Internal Server Error',
    });
}

// Read
export async function findModules(userId: number) {
    // todo: error handling
    return await ModulesRepository.findModules(userId);
}

export async function getUserModulesWithInfo(userId: number) {
    const userPreferences = await UserService.getUserPreferences(userId);
    if (!userPreferences) {
        console.error("Failed to get user preferences", userId);

        throw createError({
            statusCode: 500,
            statusMessage: "Internal Server Error"
        });
    }

    const modules = await ModulesRepository.getModuleWithDetailedAssessments(userId, userPreferences.currentYear, userPreferences.currentSemester);
    return modules;
}

// Update
export async function updateModuleById(moduleId: number, newData: InsertModule, userId: number) {
    const updated = await ModulesRepository.updateModuleById(moduleId, newData, userId);
    if (!updated) {
        console.error("Error updating module via PUT", moduleId, newData, userId);

        throw createError({
            statusCode: 500,
            statusMessage: "Internal Server Error"
        });
    }

    return updated;
}

// Delete
export async function deleteModuleById(moduleId: number, userId: number) {
    const deleted = await ModulesRepository.deleteModuleById(moduleId, userId);
    if (!deleted) {
        throw createError({
            statusCode: 404,
            statusMessage: "Module not found.",
        });
    }

    return deleted;
}