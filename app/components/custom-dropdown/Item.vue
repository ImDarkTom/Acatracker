<script setup lang="ts">
import type { DropdownMenuItemProps } from 'reka-ui';

interface CustomDropdownItemProps extends DropdownMenuItemProps {
    value: string;
    selectAction?: (event: Event) => void,
    icon?: string;
}

defineProps<CustomDropdownItemProps>();
</script>

<template>
    <DropdownMenuItem
        v-bind="$props"
        :value
        class="flex flex-row gap-2 items-center p-2 rounded-sm data-highlighted:bg-brand-muted leading-none select-none outline-none cursor-default"
        @select="selectAction">
        <Icon v-if="icon" :name="icon" size="20" />
        {{ value }}
    </DropdownMenuItem>
</template>