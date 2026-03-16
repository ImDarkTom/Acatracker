import { ICalEventData, ICalEventStatus } from "ical-generator";
import { findTasks } from "~~/lib/db/queries/tasks";
import { AssessmentsService, ModulesService } from ".";

export async function getUserEvents(userId: number, host: string) {
    let events: ICalEventData[] = [];
    
    const assessments = await AssessmentsService.getAllAssessmentsForUser(userId);
    const modules = await ModulesService.findModules(userId);
    const tasks = await findTasks(userId);

    const getModule = (moduleId: number) => modules.find((m) => m.id === moduleId);

    for (const assessment of assessments) {
        const moduleInfo = getModule(assessment.moduleId);

        // Add release date if exists
        let hasRelease = assessment.releasedAt;
        if (assessment.releasedAt) {
            events.push({
                summary: `Rel: ${moduleInfo?.code ?? '?'} - ${assessment.name}`,
                description: `${assessment.name} for ${moduleInfo?.name} release date.`,
                start: new Date(assessment.releasedAt),
                allDay: true,
                url: `${host}/dashboard/assessment/${assessment.id}#release`,
                status: assessment.isCompleted ? ICalEventStatus.CANCELLED : ICalEventStatus.CONFIRMED,
            });
        }

        // Add due/event date
        events.push({
            summary: `${hasRelease ? 'Due: ' : ''}${moduleInfo?.code ?? '?'} - ${assessment.name}`,
            description: `${assessment.name} for ${moduleInfo?.name} due date.`,
            start: new Date(assessment.dueAt),
            allDay: true,
            url: `${host}/dashboard/assessment/${assessment.id}#due`,
            status: assessment.isCompleted ? ICalEventStatus.CANCELLED : ICalEventStatus.CONFIRMED,
        });

        // Check if tasks exist, if so, add them
        const assessmentTasks = tasks.filter(t => t.assessmentId === assessment.id);

        for (const task of assessmentTasks) {
            events.push({
                summary: `Task: ${task.name} - ${moduleInfo?.code ?? '?'} - ${assessment.name}`,
                description: `Task ${task.name} for ${assessment.name} in ${moduleInfo?.name}.`,
                start: new Date(task.dueAt),
                allDay: true,
                url: `${host}/dashboard/assessment/${assessment.id}#task-${task.id}`,
                status: task.isCompleted ? ICalEventStatus.CANCELLED : ICalEventStatus.CONFIRMED,
            });
        }
    }

    return events;
}