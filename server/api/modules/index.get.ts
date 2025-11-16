import defineAuthenticatedEventHander from "../utils/defineAuthenticatedEventHandler";
import { findModules } from "~~/lib/db/queries/modules";

export default defineAuthenticatedEventHander(async (event) => {
    return findModules(event.context.user.id);
});