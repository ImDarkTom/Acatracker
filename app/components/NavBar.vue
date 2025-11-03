<script setup lang="ts">
import ThemeToggle from './ThemeToggle.vue';

</script>

<template>
    <nav class="bg-brand-900 flex items-center flex-row justify-between p-4">
        <ul class="flex flex-row gap-2">
            <li class="mr-2 text-brand-400 font-bold hover:underline">
                <NuxtLink to="/">Acatracker</NuxtLink>
            </li>
            <!-- <li>
                <NuxtLink :to="{ name: 'dashboard' }" :active-class="'border-b-2 border-brand-200 text-brand-200'">My Tasks</NuxtLink>
            </li>
            <li>
                <NuxtLink :to="{ name: 'create' }" :active-class="'border-b-2 border-brand-200 text-brand-200'">Create Task</NuxtLink>
            </li> -->
        </ul>
        <ul class="flex flex-row gap-2">
            <li class="flex items-center mr-2">
                <ThemeToggle />
            </li>
            <li>
                <AuthButton class="bg-brand-600 p-2" />
            </li>
        </ul>
    </nav>
</template>