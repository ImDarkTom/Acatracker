<template>
    <nav class="bg-gray-900 p-4">
        <ul class="flex flex-row gap-2">
            <li class="mr-2 text-blue-400 font-bold">Acatracker</li>
            <NuxtLink :to="{ name: 'index' }">Home</NuxtLink>
            <NuxtLink :to="{ name: 'create' }">Create Task</NuxtLink>
        </ul>
    </nav>
</template>