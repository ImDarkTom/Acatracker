<script setup lang="ts">
useHead({
    title: 'Acatracker | Personal Academic Tracker',
});

definePageMeta({
    layout: 'landing',
});

useSeoMeta({
    title: 'Acatracker | Personal Academic Tracker',
    description: 'Easily track your upcoming assessments and exams with Acatracker.',
    ogDescription: 'Easily track your upcoming assessments and exams with Acatracker.',
});
</script>

<template>
    <div class="flex relative min-w-full bg-[url('/img/landing.png')] bg-cover bg-center rounded-md">
        <div class="absolute top-0 left-0 w-full h-full backdrop-hue-rotate-80 bg-linear-0 from-0% from-bg-app to-bg-app/25"></div>

        <div class="relative max-w-6xl px-2 w-full mx-auto h-screen flex flex-col justify-between">

            <div class="w-full p-4 mt-2 flex flex-row items-center justify-between
                bg-bg-app/75 backdrop-blur-xs rounded-xl ring-1 ring-highlight/50 ring-inset
                shadow-md shadow-black/25">
                <AppLogoLink />
                <div class="inline-flex gap-2">
                    <AppThemeToggle class="px-1" />
                    <AuthSignUpSignInButtons />
                </div>
            </div>

            <h1 class="text-5xl font-bold text-text-primary font-serif text-center tracking-tight">Personal academic tracking for the organised</h1>

            <div class="w-full min-h-1/2 p-8
                bg-bg-app/75 backdrop-blur-xs rounded-t-xl ring-1 ring-highlight/50 ring-inset
                shadow-md shadow-black/25">
                <p class="text-text-secondary mb-4">Keep track of your upcoming assessments and exams with ease. Sync with your calendar and never risk missing important deadlines again.</p>

                <h2 class="text-2xl font-bold text-text-primary mt-8 mb-3">Features</h2>
                <ul class="ml-8 list-disc mb-6 text-text-secondary">
                    <li>Quickly add and track upcoming assessment and exam dates</li>
                    <li>Categorise assessments by module and semester/year</li>
                    <li>Easily sync with your calendar</li>
                    <li>And more...</li>
                </ul>

                <RouterLink :to="{ name: 'auth-sign-up' }">
                    <ButtonPrimary class="p-3 px-6">
                        Get started
                    </ButtonPrimary>
                </RouterLink>
            </div>
        </div>
    </div>
</template>