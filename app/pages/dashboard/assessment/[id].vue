<script setup lang="ts">
const route = useRoute();
const assesmentId = route.params.id;

const { assesments } = useAssesmentsStore();

const assesmentName = computed<string | null>(() => {
    if (!assesments) return null;
    if (!assesmentId || typeof assesmentId === 'object' || isNaN(parseInt(assesmentId))) return null;

    const selectedAssesment = assesments.find((a) => a.id === parseInt(assesmentId));
    if (!selectedAssesment) return null;

    return selectedAssesment.name;
});

useHead(() => ({
    title: `${assesmentName.value ?? 'Loading...'} | Assessment | Acatracker`
}));
</script>

<template>
    <div class="w-full flex flex-col md:flex-row gap-4 md:max-h-[calc(100vh-7rem)]">
        <div class="w-full md:w-1/3 hidden md:block">
            <DashboardAssesmentList />
        </div>
        <div class="w-full md:w-2/3 card">
            <AssessmentViewer />
        </div>
    </div>
</template>