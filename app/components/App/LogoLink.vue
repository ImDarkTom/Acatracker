<script setup lang="ts">
const auth = useAuth();
const homePageForAuthState = computed(() => auth.user.value ? '/dashboard' : '/');
</script>

<template>
    <NuxtLink 
        class="bg-linear-to-br from-brand-base to-brand-focus text-transparent bg-clip-text font-bold select-none" 
        :to="homePageForAuthState">
        Acatracker
    </NuxtLink>
</template>