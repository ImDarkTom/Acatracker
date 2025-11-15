<script lang="ts" setup>
const authStore = useAuthStore();

onMounted(async () => {
    await authStore.signOut();
});
</script>

<template>
    <div class="w-full flex justify-center">
        <LoadingIcon size="32" />
    </div>
</template>