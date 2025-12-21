<script setup lang="ts">
const route = useRoute();
const assessmentId = route.params.id;

const { assessments } = useAssessmentsStore();

const assessmentName = computed<string | null>(() => {
    if (!assessments) return null;
    if (!assessmentId || typeof assessmentId === 'object' || isNaN(parseInt(assessmentId))) return null;

    const selectedAssessment = assessments.find((a) => a.id === parseInt(assessmentId));
    if (!selectedAssessment) return null;

    return selectedAssessment.name;
});

useHead(() => ({
    title: `${assessmentName.value ?? 'Loading...'} | Assessment | Acatracker`
}));
</script>

<template>
    <div class="w-full flex flex-col md:flex-row gap-4 md:max-h-[calc(100vh-6rem)]">
        <div class="w-full md:w-1/3 hidden md:block">
            <DashboardAssessmentList />
        </div>
        <div class="w-full md:w-2/3 card">
            <AssessmentViewer />
        </div>
    </div>
</template>