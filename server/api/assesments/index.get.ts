import { findAssesments } from "~~/lib/db/queries/assesments";
import defineAuthenticatedEventHander from "~~/server/utils/defineAuthenticatedEventHandler";

export default defineAuthenticatedEventHander(async (event) => {
    return findAssesments(event.context.user.id);
});