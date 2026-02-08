<script setup lang="ts">
defineProps<{
    text: string,
}>();
</script>

<template>
    <div v-if="text">
        <div class="bg-errorbg p-2 rounded-sm">
            {{ text }}
        </div>
    </div>
</template>