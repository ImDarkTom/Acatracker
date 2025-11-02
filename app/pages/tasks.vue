<script setup lang="ts">
const { data: tasks, error, status } = await useFetch('/api/tasks', {
    lazy: true
});
</script>

<template>
    <h1>Home</h1>
    <div v-if="status === 'pending'">
        Loading...
    </div>
    <div v-else>
        <div v-for="task in tasks" :key="task.id">
            {{ task.title }}
        </div>
    </div>
</template>