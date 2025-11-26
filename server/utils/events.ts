import { ICalCategory, ICalEvent, ICalEventData, ICalEventStatus } from "ical-generator";
import { findAssesments } from "~~/lib/db/queries/assesments";
import { findModules } from "~~/lib/db/queries/modules";
import { findTasks } from "~~/lib/db/queries/tasks";

export async function getUserEvents(userId: number, host: string) {
    let events: ICalEventData[] = [];
    
    const assesments = await findAssesments(userId);
    const modules = await findModules(userId);
    const tasks = await findTasks(userId);

    const getModule = (moduleId: number) => modules.find((m) => m.id === moduleId);

    for (const assesment of assesments) {
        const moduleInfo = getModule(assesment.module);

        // Add release date if exists
        let hasRelease = assesment.releasedAt;
        if (assesment.releasedAt) {
            events.push({
                summary: `Rel: ${moduleInfo?.code ?? '?'} - ${assesment.name}`,
                description: `${assesment.name} for ${moduleInfo?.name} release date.`,
                start: new Date(assesment.releasedAt),
                allDay: true,
                url: `${host}/dashboard/assessments/${assesment.id}#release`,
                status: assesment.completed ? ICalEventStatus.CANCELLED : ICalEventStatus.CONFIRMED,
            });
        }

        // Add due/event date
        events.push({
            summary: `${hasRelease ? 'Due: ' : ''}${moduleInfo?.code ?? '?'} - ${assesment.name}`,
            description: `${assesment.name} for ${moduleInfo?.name} due date.`,
            start: new Date(assesment.dueAt),
            allDay: true,
            url: `${host}/dashboard/assessments/${assesment.id}#due`,
            status: assesment.completed ? ICalEventStatus.CANCELLED : ICalEventStatus.CONFIRMED,
        });

        // Check if tasks exist, if so, add them
        const assessmentTasks = tasks.filter(t => t.assesment === assesment.id);

        for (const task of assessmentTasks) {
            events.push({
                summary: `Task: ${task.name} - ${moduleInfo?.code ?? '?'} - ${assesment.name}`,
                description: `Task ${task.name} for ${assesment.name} in ${moduleInfo?.name}.`,
                start: new Date(task.dueAt),
                allDay: true,
                url: `${host}/dashboard/assessments/${assesment.id}#task-${task.id}`,
                status: task.completed ? ICalEventStatus.CANCELLED : ICalEventStatus.CONFIRMED,
            });
        }
    }

    return events;
}