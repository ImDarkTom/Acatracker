<script lang="ts" setup>
definePageMeta({
    layout: 'auth',
});

useHead({
    title: 'Signing out...',
    meta: [
        {
            name: 'robots',
            content: 'noindex'
        }
    ]
});

const authStore = useAuthStore();

onMounted(async () => {
    await authStore.signOut();
    await navigateTo('/');
});
</script>

<template>
    <div class="w-full flex flex-col items-center justify-center gap-2">
        <span>Signing out...</span>
        <LoadingIcon size="32" />
    </div>
</template>