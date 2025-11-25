import { ICalEventData } from "ical-generator";
import { findAssesments } from "~~/lib/db/queries/assesments";
import { findModules } from "~~/lib/db/queries/modules";
import { findTasks } from "~~/lib/db/queries/tasks";

export async function getUserEvents(userId: number) {
    let events: ICalEventData[] = [];
    
    const assesments = await findAssesments(userId);
    const modules = await findModules(userId);
    const tasks = await findTasks(userId);

    const getModule = (moduleId: number) => modules.find((m) => m.id === moduleId);

    for (const assesment of assesments) {
        const moduleInfo = getModule(assesment.id);
        if (assesment.releasedAt) {
            events.push({
                summary: `Rel: ${moduleInfo?.code ?? '?'} - ${assesment.name}`,
                description: `${assesment.name} for ${moduleInfo?.name} release date.`,
                start: new Date(assesment.releasedAt),
            });
        }

        events.push({
            summary: `Due: ${moduleInfo?.code ?? '?'} - ${assesment.name}`,
            description: `${assesment.name} for ${moduleInfo?.name} due date.`,
            start: new Date(assesment.dueAt)
        });
    }

    return events;
}