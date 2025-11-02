<script setup lang="ts">
import ThemeToggle from './ThemeToggle.vue';

</script>

<template>
    <nav class="bg-brand-900 flex flex-row justify-between p-4">
        <ul class="flex flex-row gap-2">
            <li class="mr-2 text-brand-400 font-bold">Acatracker</li>
            <li>
                <NuxtLink :to="{ name: 'index' }" :active-class="'border-b-2 border-brand-200 text-brand-200'">Home</NuxtLink>
            </li>
            <li>
                <NuxtLink :to="{ name: 'tasks' }" :active-class="'border-b-2 border-brand-200 text-brand-200'">My Tasks</NuxtLink>
            </li>
            <li>
                <NuxtLink :to="{ name: 'create' }" :active-class="'border-b-2 border-brand-200 text-brand-200'">Create Task</NuxtLink>
            </li>
        </ul>
        <ul class="flex flex-row gap-2">
            <li>
                <ThemeToggle />
            </li>
            <li>
                <button><NuxtLink :to="{ name: 'sign-in' }" :active-class="'border-b-2 border-brand-200 text-brand-200'">Sign In</NuxtLink></button>
            </li>
        </ul>
    </nav>
</template>