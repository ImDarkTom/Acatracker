import { TasksService } from "~~/server/services";
import defineAuthenticatedEventHander from "~~/server/utils/defineAuthenticatedEventHandler";

export default defineAuthenticatedEventHander(async (event) => {
    const tasks = await TasksService.findTasks(event.context.user.id);
    return tasks;
});