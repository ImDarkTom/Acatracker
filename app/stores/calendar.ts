import type { AssesmentSchema } from "~~/lib/db/schema";

type IterableEvent = { 
    type: 'released' | 'due' | 'task',
    label: string,
    link: string,
    completed: boolean,
}

export const useCalendarStore = defineStore('useCalendarStore', () => {
    const eventsByDate = computed(() => {
        const modulesStore = useModuleStore();
        const assesmentsStore = useAssesmentsStore();
        const taskStore = useTaskStore();

        const map = new Map<string, IterableEvent[]>();

        for (const item of [...(assesmentsStore.assesments ?? []), ...(taskStore.tasks ?? [])]){
            const getDateKey = (time: number) => new Date(time).toISOString().split('T')[0]!;
            const getLabel = (assesment: AssesmentSchema) => `${modulesStore.modules?.find(m => m.id == assesment.module)?.code ?? '?'} • ${assesment.name}`;

            if (!map.has(getDateKey(item.dueAt))) {
                map.set(getDateKey(item.dueAt), []);
            }

            if ('assesment' in item) {
                const assesment = assesmentsStore.assesments?.find(a => a.id === item.assesment);
                const code = modulesStore.modules?.find(m => m.id == assesment?.module)?.code ?? '?';

                // If it's a task
                map.get(getDateKey(item.dueAt))?.push({
                    type: 'task',
                    label: `${code} • ${item.name}`,
                    link: `/dashboard/assesment/${item.assesment}`,
                    completed: Boolean(item.completed),
                });
                continue;
            }

            if (item.releasedAt) {
                if (!map.has(getDateKey(item.releasedAt))) {
                    map.set(getDateKey(item.releasedAt), []);
                }

                map.get(getDateKey(item.releasedAt))?.push({
                    type: 'released',
                    label: getLabel(item),
                    link: `/dashboard/assesment/${item.id}`,
                    completed: Boolean(item.completed),
                });
            }

            map.get(getDateKey(item.dueAt))?.push({
                type: 'due',
                label: getLabel(item),
                link: `/dashboard/assesment/${item.id}`,
                completed: Boolean(item.completed),
            });
        };

        return map;
    });

    return {
        eventsByDate,
    };
});