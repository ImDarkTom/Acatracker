<script setup lang="ts">
const authStore = useAuthStore();

</script>

<template>
    <button :disabled="authStore.loading" @click="authStore.signIn" class="disabled:opacity-50 not-disabled:cursor-pointer">
        <Icon v-if="authStore.loading" name="mdi:loading" class="animate-spin" />
        <Icon v-else name="bi:github" />
        
        <span class="ml-2">Sign in with Github</span>
    </button>
</template>