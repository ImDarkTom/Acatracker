<script setup lang="ts">
definePageMeta({
    layout: 'dashboard',
});

useHead({
    title: 'Calendar | Acatracker',
});

onMounted(() => {
    useUiStore().setLastOpenedView('/dashboard/calendar');
});
</script>

<template>
    <DashboardCalendar />
</template>