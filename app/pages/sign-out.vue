<script lang="ts" setup>
const authStore = useAuthStore();

onMounted(async () => {
    await authStore.signOut();
    navigateTo('/');
});
</script>

<template>
    <div class="w-full flex justify-center">
        <Icon name="mdi:loading" class="animate-spin" size="32" />
    </div>
</template>