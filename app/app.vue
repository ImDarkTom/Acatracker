<script setup lang="ts">
import { Analytics } from '@vercel/analytics/nuxt';
</script>

<template>
    <Analytics />
    <TooltipProvider>
        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
    </TooltipProvider>
</template>