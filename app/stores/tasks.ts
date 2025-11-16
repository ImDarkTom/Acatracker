export const useTaskStore = defineStore('useTaskStore', () => {
    const { data, status, refresh } = useFetch('/api/tasks', { lazy: true });

    return {
        tasks: data,
        status,
        refresh,
    };
});