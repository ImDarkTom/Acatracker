import { InsertAssessment } from "~~/lib/db/schema";
import { validateBody } from "~~/server/utils/validation";
import { AssessmentsService } from "~~/server/services";

export default defineAuthenticatedEventHandler(async (event) => {
    const bodyData = await validateBody(event, InsertAssessment);

    await AssessmentsService.createAssessment(bodyData, event.context.user.id);
    setResponseStatus(event, 201); // Created
});