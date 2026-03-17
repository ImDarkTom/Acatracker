import { ModulesService } from "~~/server/services";
import { parseIdParam } from "~~/server/utils/validation";

export default defineAuthenticatedEventHandler(async (event) => {
    const moduleId = parseIdParam(event);

    await ModulesService.deleteModuleById(moduleId, event.context.user.id);
    setResponseStatus(event, 204);
});