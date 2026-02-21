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
        <div class="absolute top-0 left-0 w-full h-full backdrop-hue-rotate-80 bg-linear-90 from-50% from-bg-app via-65% via-bg-app/80 to-bg-app/25">
            <div class="p-1 pl-4 top-0 left-0 w-full flex flex-row items-center justify-between">
                <AppLogoLink />
                <div class="bg-bg-app p-2 rounded-md ring-1 ring-highlight/50 ring-inset flex flex-row items-center gap-2 shadow-md shadow-black/25">
                    <AppThemeToggle class="px-1" />
                    <AuthSignUpSignInButtons />
                </div>
            </div>
            
            <div class="h-full max-w-1/2 w-full bg-bg-app p-4">
                <h1 class="text-4xl font-bold text-text-primary font-serif mt-4 mb-4 tracking-tight">Personal academic tracking for the organised.</h1>
                
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