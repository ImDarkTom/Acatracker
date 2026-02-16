import { getModuleWithDetailedAssessments } from "~~/lib/db/queries/modules";

export default defineAuthenticatedEventHandler(async (event) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const userId = event.context.user.id;
    const queryParams = getQuery(event);

    const year = Number(queryParams.year);
    const semester = Number(queryParams.semester);

    if (isNaN(year) || isNaN(semester)) {
        throw createError({
            statusCode: 400,
            message: 'Year and semester are requred and must be numbers.',
        });
    }

    const results = await getModuleWithDetailedAssessments(userId, year, semester);

    if (results.length === 0) {
        throw createError({
            statusCode: 404,
            message: 'No items found.',
        });
    }

    return results;
});