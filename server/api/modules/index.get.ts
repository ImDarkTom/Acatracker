import { ModulesService } from "~~/server/services";

export default defineAuthenticatedEventHandler(async (event) => {
    return await ModulesService.findModules(event.context.user.id)
});