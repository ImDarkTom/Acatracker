<script setup lang="ts">
const auth = useAuth();
const homePageForAuthState = computed(() => auth.user.value ? '/dashboard' : '/');
</script>

<template>
    <RouterLink 
        class="text-brand-active font-bold select-none" 
        :to="homePageForAuthState">
        Acatracker
    </RouterLink>
</template>