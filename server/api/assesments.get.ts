import { findAssesments } from "~~/lib/db/queries/assesments";
import defineAuthenticatedEventHander from "../utils/defineAuthenticatedEventHandler";

export default defineAuthenticatedEventHander(async (event) => {
    return findAssesments(event.context.user.id);
});