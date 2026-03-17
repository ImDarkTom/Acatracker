import { InsertTask } from "~~/lib/db/schema";
import { TasksService } from "~~/server/services";
import { parseIdParam, validateBody } from "~~/server/utils/validation";

export default defineAuthenticatedEventHandler(async (event) => {
    const taskId = parseIdParam(event);
    const bodyData = await validateBody(event, InsertTask.partial());

    await TasksService.updateTaskById(taskId, bodyData, event.context.user.id);
    setResponseStatus(event, 204);
});