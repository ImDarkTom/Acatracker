<script setup lang="ts">
definePageMeta({
    layout: 'dashboard',
});

useHead({
    title: 'Home | Acatracker',
});

onMounted(() => {
    useUiStore().setLastOpenedView('/dashboard');
});
</script>

<template>
    <div>home</div>
</template>