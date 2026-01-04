<script setup lang="ts">
const authStore = useAuthStore();
</script>

<template>
    <ButtonSecondary
        class="justify-center"
        @click="authStore.signIn">
        <LoadingIcon v-if="authStore.isLoading" />
        <Icon v-else name="mdi:github" />
        
        <span>Continue with Github</span>
    </ButtonSecondary>
</template>