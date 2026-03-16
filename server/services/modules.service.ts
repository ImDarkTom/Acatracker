import { UserService } from ".";
import { ModulesRepository } from "../repositories";

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