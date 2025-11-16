import { findModules } from "~~/lib/db/queries/modules";
import defineAuthenticatedEventHander from "~~/server/utils/defineAuthenticatedEventHandler";

export default defineAuthenticatedEventHander(async (event) => {
    return findModules(event.context.user.id);
});