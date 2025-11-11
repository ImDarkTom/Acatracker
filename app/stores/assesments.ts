export const useAssesmentsStore = defineStore('useAssesmentsStore', () => {
    const { data, status, refresh } = useFetch('/api/assesments', { lazy: true });

    return {
        assesments: data,
        status,
        refresh,
    };
});