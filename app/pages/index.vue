<script setup lang="ts">
useHead({
    title: 'Acatracker | Personal Academic Tracker',
});

useSeoMeta({
    title: 'Acatracker | Personal Academic Tracker',
    description: 'Easily track your upcoming assessments and exams with Acatracker.',
    ogDescription: 'Easily track your upcoming assessments and exams with Acatracker.',
});

const auth = useAuth();
</script>

<template>
    <div class="w-full flex flex-col items-center justify-center gap-2 mb-10">
        <h1 class="text-5xl font-bold bg-linear-to-br from-brand-base to-brand-focus text-transparent bg-clip-text">Acatracker</h1>
        <p class="mb-2">Open-source academic tracker.</p>

        <NuxtLink v-if="auth.user.value" :to="{ name: 'dashboard' }">
            <ButtonPrimary class="p-4">
                Open Dashboard
            </ButtonPrimary>
        </NuxtLink>
        <AuthButton v-else class="p-4" />
    </div>
</template>