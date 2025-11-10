export const useModuleStore = defineStore('useModulesStore', () => {
    const { data, status, refresh } = useFetch('/api/modules', { lazy: true });

    return {
        modules: data,
        status,
        refresh,
    };
});