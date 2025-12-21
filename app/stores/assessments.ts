import type { AssessmentSchema } from "~~/lib/db/schema";

export const useAssessmentsStore = defineStore('useAssessmentsStore', () => {
    const { data: assessments, pending, refresh } = useFetch('/api/assessments', { lazy: true });
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
        await $csrfFetch("/api/assessments", {
            method: 'POST',
            body: values,
        });

        refresh();
        useCalendarEvents().refresh();
    }

    async function editAssessment(values: Record<string, any>, assessmentId: number) {
        await $csrfFetch(`/api/assessments/${assessmentId}`, {
            method: 'PUT',
            body: values,
        });

        refresh();
        // Since we can edit assessments from the sidebar, calendar won't refresh since we don't
        // remount it like when we edit tasks
        useCalendarEvents().refresh();
    }

    async function deleteAssessment(assessment: AssessmentSchema) {
        if (!confirm(`Are you sure you want to delete '${assessment.name}'?`)) return;

        await $fetch(`/api/assessments/${assessment.id}`, {
            method: 'DELETE'
        });

        refresh();
        useCalendarEvents().refresh();
    }

    return {
        assessments,
        pending,
        refresh,
        assessmentsCount,
        addAssessment,
        editAssessment,
        deleteAssessment,
    };
});