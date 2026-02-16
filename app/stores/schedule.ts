import type { InsertTask } from "~~/lib/db/schema";

export const useScheduleStore = defineStore('useScheduleStore', () => {
    const userPreferences = useUserPreferencesStore();
    const { $csrfFetch } = useNuxtApp();

    const { data: schedule, pending, error, refresh } = useFetch('/api/schedule', {
        query: {
            year: userPreferences.preferences?.currentYear,
            semester: userPreferences.preferences?.currentSemester,
        },
        lazy: true,
    });

    function getAssessmentBySlug(slug: unknown) {
        return computed(() => {
            for (const module of schedule.value ?? []) {
                const match = module.assessments.find(a => a.slug === slug);
                if (match) return match;
            }
            return null;
        });
    }

    // Tasks
    const taskOperations = {
        async add(values: Record<string, any>) {
            await $csrfFetch("/api/tasks", {
                method: 'POST',
                body: values,
            });
        },
        
        async update(values: Partial<InsertTask>, taskId: number) {
            await $csrfFetch(`/api/tasks/${taskId}`, {
                method: 'PATCH',
                body: values,
            });
        },
        
        async toggleCompleted(id: number, completed: boolean) {
            await $csrfFetch(`/api/tasks/${id}`, {
                method: 'PATCH',
                body: { completed },
            });
        },
        
        async delete(id: number) {
            await $fetch(`/api/tasks/${id}`, {
                method: 'DELETE'
            });
        },
    };
        
    return {
        schedule,
        pending,
        error,
        refresh,
        getAssessmentBySlug,
        task: taskOperations
    }
});