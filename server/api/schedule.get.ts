import { getModuleWithDetailedAssessments } from "~~/lib/db/queries/modules";

export default defineAuthenticatedEventHandler(async (event) => {
    const userId = event.context.user.id;

    const results = await getModuleWithDetailedAssessments(userId);

    if (!results) {
        // No results means we failed to get user preferences.
        throw createError({
            statusCode: 500,
            message: 'Internal server error.',
        });
    }

    return results;
});