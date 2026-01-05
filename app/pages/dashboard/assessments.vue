<script setup lang="ts">
useHead({
    title: 'Dashboard | Acatracker',
});
</script>

<template>
    <div class="w-full flex flex-col md:flex-row gap-4 md:max-h-[calc(100vh-6rem)]">
        <div class="w-full md:w-1/3">
            <DashboardAssessmentList />
        </div>
        <div class="w-full md:w-2/3 hidden md:block card p-0">
            <NuxtPage />
        </div>
    </div>
</template>