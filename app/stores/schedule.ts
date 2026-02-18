import { fromDate, getLocalTimeZone, isSameDay } from "@internationalized/date";
import type { DateValue } from "reka-ui";
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
            pending += module.assessments.filter(a => !a.isCompleted).length
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
        },
    
        async edit(values: Record<string, any>, moduleId: number) {
            await $csrfFetch(`/api/modules/${moduleId}`, {
                method: 'PUT',
                body: values,
            });
    
            refresh();
        },
    
        async delete(moduleId: number) {
            await $fetch(`/api/modules/${moduleId}`, {
                method: 'DELETE'
            });
    
            refresh();
        },
    }

    const assessmentOperations = {
        async add(values: Record<string, any>) {
            await $csrfFetch("/api/assessments", {
                method: 'POST',
                body: values,
            });

            refresh();
        },

        async update(slug: string, values: Partial<InsertAssessment>) {
            await $csrfFetch(`/api/assessments/${slug}`, {
                method: 'PATCH',
                body: values,
            });

            refresh();
        },

        async toggleCompleted(slug: string, isCompleted: boolean) {
            await $csrfFetch(`/api/assessments/${slug}`, {
                method: 'PATCH',
                body: { isCompleted },
            });

            refresh();
        },

        // Delete
        async delete(slug: string) {
            await $fetch(`/api/assessments/${slug}`, {
                method: 'DELETE'
            });

            refresh();
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
        
        async toggleCompleted(id: number, isCompleted: boolean) {
            await $csrfFetch(`/api/tasks/${id}`, {
                method: 'PATCH',
                body: { isCompleted },
            });
        },
        
        async delete(id: number) {
            await $fetch(`/api/tasks/${id}`, {
                method: 'DELETE'
            });
        },
    };

    const calendarOperations = {
        eventsForDate(dateValue: DateValue): IterableEvent[] {
            if (!schedule.value) return [];

            const timezone = getLocalTimeZone();
            const events: IterableEvent[] = [];

            const isOnDate = (timestamp: number) => 
                isSameDay(dateValue, fromDate(new Date(timestamp), timezone));

            for (const module of schedule.value) {
                for (const assessment of module.assessments) {
                    const assessmentLabel = `${module.code} • ${assessment.name}`;

                    if (assessment.releasedAt && isOnDate(assessment.releasedAt)) {
                        events.push({
                            id: assessment.id.toString(),
                            type: 'released',
                            label: assessmentLabel,
                            isCompleted: assessment.isCompleted ?? false,
                            link: `/dashboard/assessment/${assessment.slug}#release`,
                        });
                    }

                    if (isOnDate(assessment.dueAt)) {
                        events.push({
                            id: assessment.id.toString(),
                            type: 'due',
                            label: assessmentLabel,
                            isCompleted: assessment.isCompleted ?? false,
                            link: `/dashboard/assessment/${assessment.slug}#due`,
                        });
                    }

                    for (const task of assessment.tasks) {
                        if (isOnDate(task.dueAt)) {
                            events.push({
                                type: 'task',
                                id: task.id.toString(),
                                label: `${module.code} • ${task.name}`,
                                isCompleted: task.isCompleted ?? false,
                                link: `/dashboard/assessment/${assessment.slug}#task-${task.id}`,
                            });
                        }
                    }
                }
            }

            return events;
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
        calendar: calendarOperations,
    }
});