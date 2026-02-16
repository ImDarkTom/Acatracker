import type { InsertAssessment } from "~~/lib/db/schema";

export const useAssessmentsStore = defineStore('useAssessmentsStore', () => {
    const { data: assessments, pending, refresh: fetchRefresh } = useFetch('/api/assessments', { lazy: true });
    const { $csrfFetch } = useNuxtApp();

    const assessmentsCount = computed(() => {
        const allAssessments = assessments.value;
        if (!allAssessments) return {
            pending: 0,
            total: 0
        }

        const pending = allAssessments.filter(a => !a.completed).length;
        const total = allAssessments.length;

        return {
            pending,
            total
        };
    });


    // ----
    // CRUD
    // ----

    // Create
    async function addAssessment(values: Record<string, any>) {
        await $csrfFetch("/api/assessments", {
            method: 'POST',
            body: values,
        });

        fetchRefresh();
        useCalendarEvents().refresh();
    }

    // Update
    async function updateAssessment(slug: string, values: Partial<InsertAssessment>) {
        await $csrfFetch(`/api/assessments/${slug}`, {
            method: 'PATCH',
            body: values,
        });

        fetchRefresh();
        // Since we can edit assessments from the sidebar, calendar won't
        // refresh since we don't remount it like when we edit tasks
        useCalendarEvents().refresh();
    }

    async function toggleAssessmentCompleted(slug: string, completed: boolean) {
        await $csrfFetch(`/api/assessments/${slug}`, {
            method: 'PATCH',
            body: { completed },
        });

        fetchRefresh();
        useCalendarEvents().refresh();
        useScheduleStore().refresh();
    }

    // Delete
    async function deleteAssessment(slug: string) {
        await $fetch(`/api/assessments/${slug}`, {
            method: 'DELETE'
        });

        fetchRefresh();
        useCalendarEvents().refresh();
    }

    return {
        assessments,
        pending,
        refresh: fetchRefresh,
        assessmentsCount,
        addAssessment,
        updateAssessment,
        toggleAssessmentCompleted,
        deleteAssessment,
    };
});