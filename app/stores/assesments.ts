import type { AssesmentSchema, ModuleSchema } from "~~/lib/db/schema";

export const useAssesmentsStore = defineStore('useAssesmentsStore', () => {
    const { data, status, refresh } = useFetch('/api/assesments', { lazy: true });

    const eventsByDate = computed(() => {
        const { modules } = useModuleStore();
        const map = new Map<string, {type: 'released' | 'due', assesment: AssesmentSchema, module?: ModuleSchema }[]>();

        for (const assesment of data.value ?? []) {
            const dueKey = new Date(assesment.dueAt).toISOString().split('T')[0]!;

            if (!map.has(dueKey)) {
                map.set(dueKey, []);
            }
            map.get(dueKey)?.push({type: 'due', assesment, module: modules?.find(m => m.id == assesment.module) });

            if (!assesment.releasedAt) continue;
            const releasedKey = new Date(assesment.releasedAt).toISOString().split('T')[0]!;

            if (!map.has(releasedKey)) {
                map.set(releasedKey, []);
            }
            map.get(releasedKey)?.push({ type: 'released', assesment, module: modules?.find(m => m.id == assesment.module) });
        }

        return map;
    });

    return {
        assesments: data,
        status,
        refresh,
        eventsByDate,
    };
});