<script lang="ts" setup>
const authStore = useAuthStore();

useHead({
    title: 'Signing out...',
    meta: [
        {
            name: 'robots',
            content: 'noindex'
        }
    ]
});

onMounted(async () => {
    await authStore.signOut();
    await navigateTo('/');
});
</script>

<template>
    <div class="w-full flex justify-center">
        <LoadingIcon size="32" />
    </div>
</template>