import { ModulesService } from "../services";

export default defineAuthenticatedEventHandler(async (event) => {
    const modules = ModulesService.getUserModulesWithInfo(event.context.user.id);
    return modules;
});