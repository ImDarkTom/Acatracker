import type { AssesmentSchema } from "~~/lib/db/schema";

export const useAssesmentsStore = defineStore('useAssesmentsStore', () => {
    const { data: assessments, pending, refresh } = useFetch('/api/assesments', { lazy: true });
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

    async function addAssessment(values: Record<string, any>) {
        await $csrfFetch("/api/assesments", {
            method: 'POST',
            body: values,
        });

        refresh();
        useCalendarEvents().refresh();
    }

    async function editAssessment(values: Record<string, any>, assessmentId: number) {
        await $csrfFetch(`/api/assesments/${assessmentId}`, {
            method: 'PUT',
            body: values,
        });

        refresh();
        // Since we can edit assessments from the sidebar, calendar won't refresh since we don't
        // remount it like when we edit tasks
        useCalendarEvents().refresh();
    }

    async function deleteAssesment(assesment: AssesmentSchema) {
        if (!confirm(`Are you sure you want to delete '${assesment.name}'?`)) return;

        await $fetch(`/api/assesments/${assesment.id}`, {
            method: 'DELETE'
        });

        refresh();
        useCalendarEvents().refresh();
    }

    return {
        assesments: assessments,
        pending,
        refresh,
        assessmentsCount,
        addAssessment,
        editAssessment,
        deleteAssesment,
    };
});