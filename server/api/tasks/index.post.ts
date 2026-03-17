import { InsertTask } from "~~/lib/db/schema";
import { validateBody } from "~~/server/utils/validation";
import { TasksService } from "~~/server/services";

export default defineAuthenticatedEventHandler(async (event) => {
    const bodyData = await validateBody(event, InsertTask);

    await TasksService.insertTask(bodyData, event.context.user.id);
    setResponseStatus(event, 204);
});