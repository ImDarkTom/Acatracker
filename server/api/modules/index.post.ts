import { DrizzleError } from "drizzle-orm";
import { InsertModule } from "~~/lib/db/schema";
import { insertModule } from "~~/lib/db/queries/modules";
import defineAuthenticatedEventHander from "../../utils/defineAuthenticatedEventHandler";
import { validateBody } from "~~/server/utils/validation";

export default defineAuthenticatedEventHander(async (event) => {
    const bodyData = await validateBody(event, InsertModule);

    try {
        return insertModule(bodyData, event.context.user.id);
    } catch (e) {
        const error = e as DrizzleError;
        throw error;
    }
});