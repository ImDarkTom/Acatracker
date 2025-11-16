import { findTasks } from "~~/lib/db/queries/tasks";
import defineAuthenticatedEventHander from "~~/server/utils/defineAuthenticatedEventHandler";

export default defineAuthenticatedEventHander(async (event) => {
    return findTasks(event.context.user.id);
});