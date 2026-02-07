<script setup lang="ts">
definePageMeta({
    layout: 'dashboard',
});

const route = useRoute();
const assessmentSlug = route.params.slug;

const { assessments } = useAssessmentsStore();

const assessmentName = computed<string | null>(() => {
    if (!assessments) return null;
    if (!assessmentSlug || typeof assessmentSlug === 'object') return null;

    const selectedAssessment = assessments.find((a) => a.slug === assessmentSlug);
    if (!selectedAssessment) return null;

    return selectedAssessment.name;
});

useHead(() => ({
    title: `${assessmentName.value ?? 'Loading...'} | Assessment | Acatracker`
}));
</script>

<template>
    <AssessmentViewer />
</template>