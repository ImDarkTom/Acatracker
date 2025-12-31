import { AssessmentSchema, ModuleSchema, TaskSchema } from "~~/lib/db/schema";

type CalendarEvents = {
    date: string,
    events: {
        id: number,
        type: 'task' | 'released' | 'due',
        label: string,
        link: string,
        completed: boolean
    }[]
}[]

export function transformToCalendarEvents(
    userModules: ModuleSchema[],
    userAssessments: AssessmentSchema[],
    userTasks: TaskSchema[]
): CalendarEvents {
    const map = new Map<string, IterableEvent[]>();

    for (const item of [...userAssessments, ...userTasks]) {
        const getDateKey = (time: number) => new Date(time).toISOString().split('T')[0]!;
        const getLabel = (assessment: AssessmentSchema) => 
            `${userModules.find(m => m.id == assessment.module)?.code ?? '?'} • ${assessment.name}`;

        if (!map.has(getDateKey(item.dueAt))) {
            map.set(getDateKey(item.dueAt), []);
        }

        if ('assessment' in item) {
            const assessment = userAssessments.find(a => a.id === item.assessment);
            const code = userModules.find(m => m.id == assessment?.module)?.code ?? '?';

            // If it's a task
            map.get(getDateKey(item.dueAt))?.push({
                id: item.assessment,
                type: 'task',
                label: `${code} • ${item.name}`,
                link: `/dashboard/assessment/${item.assessment}`,
                completed: Boolean(item.completed),
            });
            continue;
        }

        if (item.releasedAt) {
            if (!map.has(getDateKey(item.releasedAt))) {
                map.set(getDateKey(item.releasedAt), []);
            }

            map.get(getDateKey(item.releasedAt))?.push({
                id: item.id,
                type: 'released',
                label: getLabel(item),
                link: `/dashboard/assessment/${item.id}`,
                completed: Boolean(item.completed),
            });
        }

        map.get(getDateKey(item.dueAt))?.push({
            id: item.id,
            type: 'due',
            label: getLabel(item),
            link: `/dashboard/assessment/${item.id}`,
            completed: Boolean(item.completed),
        });
    }

    return Array.from(map.entries()).map(([date, events]) => ({
        date,
        events,
    }));
}