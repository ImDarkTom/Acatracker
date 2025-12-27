<script setup lang="ts">
import type { DropdownMenuSeparatorProps } from 'reka-ui';

defineProps<DropdownMenuSeparatorProps>();
</script>

<template>
    <DropdownMenuSeparator v-bind="$props" class="h-px w-full bg-text-secondary my-1" />
</template>