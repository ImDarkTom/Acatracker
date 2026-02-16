import type { OptGroupEntry } from "~/types/dynamicForm";
import type { InsertAssessment, InsertTask } from "~~/lib/db/schema";

export const useScheduleStore = defineStore('useScheduleStore', () => {
    const { $csrfFetch } = useNuxtApp();

    const { data: schedule, pending, error, refresh } = useFetch('/api/schedule', {
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

    const moduleSelectorOptions = computed<OptGroupEntry[]>(() => {
        if (!schedule.value) return [];

        const options = schedule.value.map(module => [module.id, module.name] as [number, string]);

        return [
            {
                label: 'Current Modules',
                options,
            }
        ]
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

    const assessmentOperations = {
        async add(values: Record<string, any>) {
            await $csrfFetch("/api/assessments", {
                method: 'POST',
                body: values,
            });

            refresh();
            useCalendarEvents().refresh();
        },

        async update(slug: string, values: Partial<InsertAssessment>) {
            await $csrfFetch(`/api/assessments/${slug}`, {
                method: 'PATCH',
                body: values,
            });

            refresh();
            // Since we can edit assessments from the sidebar, calendar won't
            // refresh since we don't remount it like when we edit tasks
            useCalendarEvents().refresh();
        },

        async toggleCompleted(slug: string, completed: boolean) {
            await $csrfFetch(`/api/assessments/${slug}`, {
                method: 'PATCH',
                body: { completed },
            });

            refresh();
            useCalendarEvents().refresh();
        },

        // Delete
        async delete(slug: string) {
            await $fetch(`/api/assessments/${slug}`, {
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
        moduleSelectorOptions,
        module: moduleOperations,
        assessment: assessmentOperations,
        task: taskOperations,
    }
});