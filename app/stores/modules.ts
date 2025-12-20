import type { ModuleSchema } from "~~/lib/db/schema";

export const useModuleStore = defineStore('useModulesStore', () => {
    const { data: modules, status, refresh } = useFetch('/api/modules', { lazy: true });
    const { $csrfFetch } = useNuxtApp();

    const moduleSelectorOptions = computed<[number, string][]>(() => {
        return (modules.value || []).map((m) => [ m.id, m.name ]);
    });

    async function addModule(values: Record<string, any>) {
        await $csrfFetch("/api/modules", {
            method: 'POST',
            body: values,
        });

        refresh();
        useCalendarEvents().refresh();
    }

    async function editModule(values: Record<string, any>, moduleId: number) {
        await $csrfFetch(`/api/modules/${moduleId}`, {
            method: 'PUT',
            body: values,
        });

        refresh();
        useCalendarEvents().refresh();
    }

    async function deleteModule(module: ModuleSchema) {
        if (!confirm(`Are you sure you want to delete the '${module.name}' module?`)) return;

        await $fetch(`/api/modules/${module.id}`, {
            method: 'DELETE'
        });

        refresh();
        useCalendarEvents().refresh();
    }

    return {
        modules,
        status,
        refresh,
        moduleSelectorOptions,
        addModule,
        editModule,
        deleteModule,
    };
});