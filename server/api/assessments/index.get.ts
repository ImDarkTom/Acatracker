import { AssessmentsService } from "~~/server/services";

export default defineAuthenticatedEventHandler(async (event) => {
    return await AssessmentsService.getAllAssessmentsForUser(event.context.user.id);
});