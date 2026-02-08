<script setup lang="ts">
const auth = useAuth();
</script>

<template>
    <ButtonSecondary
        class="justify-center"
        @click="auth.signInWithGitHub">
        <LoadingIcon v-if="auth.isLoading.value" />
        <Icon v-else name="mdi:github" />
        
        <span>Continue with Github</span>
    </ButtonSecondary>
</template>