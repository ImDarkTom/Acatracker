<script setup lang="ts">
const authStore = useAuthStore();
await authStore.init();
</script>

<template>
    <div class="min-h-screen flex flex-col">
        <AppNavBar />
        <div class="p-4 flex grow">
            <slot />
        </div>
    </div>
</template>