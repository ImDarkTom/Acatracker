<script setup lang="ts">
const authStore = useAuthStore();
await authStore.init();
</script>

<template>
    <div class="min-h-screen flex flex-col">
        <AppNavBar />
        <div class="w-full min-h-[calc(100dvh-4.5rem)] flex flex-col md:flex-row gap-4 p-4">
            <div class="w-full md:w-1/3 min-h-[calc(50dvh-4rem)] md:min-h-full">
                <DashboardAssessmentList />
            </div>
            <div class="w-full md:w-2/3 min-h-[calc(50dvh-4rem)] md:min-h-full flex card">
                <slot />
            </div>
        </div>
    </div>
</template>