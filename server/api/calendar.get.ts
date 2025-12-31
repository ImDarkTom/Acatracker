import { findAssessments } from "~~/lib/db/queries/assessments";
import { findModules } from "~~/lib/db/queries/modules";
import { findTasks } from "~~/lib/db/queries/tasks";
import { transformToCalendarEvents } from "../utils/calendar";

export default defineAuthenticatedEventHandler(async (event) => {
    const user = event.context.user;
    const userModules = await findModules(user.id);
    const userAssessments = await findAssessments(user.id);
    const userTasks = await findTasks(user.id);

    return transformToCalendarEvents(userModules, userAssessments, userTasks)
});