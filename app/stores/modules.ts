import type { OptGroupEntry } from "~/types/dynamicForm";
import type { ModuleSchema } from "~~/lib/db/schema";

export const useModuleStore = defineStore('useModulesStore', () => {
    const { data: modules, status, refresh } = useFetch('/api/modules', { lazy: true });
    const { $csrfFetch } = useNuxtApp();

    const preferencesStore = useUserPreferencesStore();
    const { preferences } = storeToRefs(preferencesStore);

    const moduleSelectorOptions = computed<OptGroupEntry[]>(() => {
        if (!modules.value || modules.value.length === 0) return [];

        const groupedModules = Object.groupBy(modules.value, ({ year, semester }) => {
            if (
                year === preferences.value?.currentYear
                && semester === preferences.value?.currentSemester
            ) {
                return 'Active Modules';
            } else {
                return 'Other Modules';
            }
        });

        const formatted = Object.entries(groupedModules).map<OptGroupEntry>(([ groupLabel, modules ]) => ({
            label: groupLabel,
            options: modules.map(module => [module.id, module.name]) ?? [],
        }));

        return formatted;
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