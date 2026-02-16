<script setup lang="ts">
definePageMeta({
    layout: 'dashboard',
});

useHead({
    title: 'Timeline | Acatracker',
});

onMounted(() => {
    useUiStore().setLastOpenedView('/dashboard/timeline');
});
</script>

<template>
    <div>timeline</div>
</template>