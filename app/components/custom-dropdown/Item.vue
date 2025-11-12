<script setup lang="ts">
defineProps<{
    value: string;
    selectAction?: (event: Event) => void,
    icon?: string;
}>();
</script>

<template>
    <DropdownMenuItem 
        :value
        class="flex flex-row gap-2 items-center p-2 data-highlighted:bg-brand-700 leading-none select-none outline-none"
        @select="selectAction">
        <Icon v-if="icon" :name="icon" size="20" />
        {{ value }}
    </DropdownMenuItem>
</template>