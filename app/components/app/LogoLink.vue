<script setup lang="ts">
const authStore = useAuthStore();
const homePageForAuthState = computed(() => authStore.user ? '/dashboard' : '/');
</script>

<template>
    <RouterLink 
        class="text-brand-active font-bold select-none" 
        :to="homePageForAuthState">
        Acatracker
    </RouterLink>
</template>