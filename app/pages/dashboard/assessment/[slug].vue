<script setup lang="ts">
definePageMeta({
    layout: 'dashboard',
});

const route = useRoute();
const slugFromParams = route.params.slug;

const scheduleStore = useScheduleStore();
const { schedule, pending, error } = storeToRefs(scheduleStore);

const assessment = scheduleStore.getAssessmentBySlug(slugFromParams);

const assessmentName = computed<string>(() => {
    if (!assessment.value) return "Invalid Assessment";
    return assessment.value.name;
});

useHead(() => ({
    title: `${assessmentName.value} | Assessment | Acatracker`
}));
</script>

<template>
    <div 
        v-if="pending || !schedule" 
        class="grow flex items-center justify-center">
        <LoadingIcon />
    </div>
    <div 
        v-else-if="error || !assessment"
        class="grow flex flex-col gap-2 items-center justify-center">
        Oh no!: {{ error ?? 'An unknown error occurred.' }}
        <AppBackBtn />
    </div>
    <AssessmentDetails v-else :assessment />
</template>