import { InsertModule } from "~~/lib/db/schema";
import { validateBody } from "~~/server/utils/validation";
import { ModulesService } from "~~/server/services";

export default defineAuthenticatedEventHandler(async (event) => {
    const bodyData = await validateBody(event, InsertModule);

    await ModulesService.createModule(bodyData, event.context.user.id);
    setResponseStatus(event, 204);
});