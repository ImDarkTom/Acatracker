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

    const assessmentsCount = computed(() => {
        if (!schedule.value) return { total: 0, pending: 0 };

        let total = 0;
        let pending = 0;
        for (const module of schedule.value) {
            total += module.assessments.length;
            pending += module.assessments.filter(a => !a.completed).length
        }

        return {
            pending,
            total
        };
    });

    const moduleOperations = {
        async add(values: Record<string, any>) {
            await $csrfFetch("/api/modules", {
                method: 'POST',
                body: values,
            });
    
            refresh();
            useCalendarEvents().refresh();
        },
    
        async edit(values: Record<string, any>, moduleId: number) {
            await $csrfFetch(`/api/modules/${moduleId}`, {
                method: 'PUT',
                body: values,
            });
    
            refresh();
            useCalendarEvents().refresh();
        },
    
        async delete(moduleId: number) {
            await $fetch(`/api/modules/${moduleId}`, {
                method: 'DELETE'
            });
    
            refresh();
            useCalendarEvents().refresh();
        },
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
        assessmentsCount,
        module: moduleOperations,
        task: taskOperations,
    }
});