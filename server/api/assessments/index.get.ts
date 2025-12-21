import { findAssessments } from "~~/lib/db/queries/assessments";
import defineAuthenticatedEventHander from "~~/server/utils/defineAuthenticatedEventHandler";

export default defineAuthenticatedEventHander(async (event) => {
    return findAssessments(event.context.user.id);
});