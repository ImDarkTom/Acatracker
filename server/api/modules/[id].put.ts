import { InsertModule } from "~~/lib/db/schema";
import { ModulesService } from "~~/server/services";
import { parseIdParam, validateBody } from "~~/server/utils/validation";

export default defineAuthenticatedEventHandler(async (event) => {
    const moduleId = parseIdParam(event);
    const bodyData = await validateBody(event, InsertModule);

    await ModulesService.updateModuleById(moduleId, bodyData, event.context.user.id);
    setResponseStatus(event, 204);
});