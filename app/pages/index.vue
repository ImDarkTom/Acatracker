<script setup lang="ts">
useHead({
    title: 'Acatracker | Personal Academic Tracker',
    meta: [
        {
            name: 'description',
            content: 'Easily track your upcoming assessments and exams with Acatracker.'
        }
    ]
});

const authStore = useAuthStore();
</script>

<template>
    <div class="w-full flex flex-col items-center justify-center gap-2 mb-10">
        <h1 class="text-5xl font-bold bg-linear-to-br from-brand-500 to-brand-300 text-transparent bg-clip-text">Acatracker</h1>
        <p class="mb-2">Open-source academic tracker.</p>

        <NuxtLink v-if="authStore.user" :to="{ name: 'dashboard' }">
            <AppBtnPrimary class="p-4">
                Open Dashboard
            </AppBtnPrimary>
        </NuxtLink>
        <AuthButton v-else class="p-4" />
    </div>
</template>