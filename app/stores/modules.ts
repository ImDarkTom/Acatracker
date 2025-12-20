export const useModuleStore = defineStore('useModulesStore', () => {
    const { data: modules, status, refresh } = useFetch('/api/modules', { lazy: true });

    const moduleSelectorOptions = computed<[number, string][]>(() => {
        return (modules.value || []).map((m) => [ m.id, m.name ]);
    });

    return {
        modules,
        status,
        refresh,
        moduleSelectorOptions,
    };
});