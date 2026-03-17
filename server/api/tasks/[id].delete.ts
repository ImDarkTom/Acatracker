import { TasksService } from "~~/server/services";
import { parseIdParam } from "~~/server/utils/validation";

export default defineAuthenticatedEventHandler(async (event) => {
    const taskId = parseIdParam(event);

    await TasksService.deleteTaskById(taskId, event.context.user.id);
    setResponseStatus(event, 204);
});