<script setup lang="ts">
useHead({
    title: 'Acatracker'
});

const authStore = useAuthStore();
const router = useRouter();

onMounted(() => {
    if (authStore.user && !authStore.isLoading) {
        router.push('/dashboard');
    }
});
</script>

<template>
    <div class="w-full flex flex-col items-center justify-center gap-2 mb-10">
        <h1 class="text-5xl font-bold text-brand-100">Acatracker</h1>
        <p class="mb-2">Open-source academic tracker.</p>

        <NuxtLink v-if="authStore.user" :to="{ name: 'dashboard' }">
            <AppBtnPrimary class="p-4">
                Open Dashboard
            </AppBtnPrimary>
        </NuxtLink>
        <AuthButton v-else class="p-4" />
    </div>
</template>