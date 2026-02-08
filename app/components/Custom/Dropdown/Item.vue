<script setup lang="ts">
import type { DropdownMenuItemProps } from 'reka-ui';
import { RouterLink } from 'vue-router';

interface CustomDropdownItemProps extends DropdownMenuItemProps {
    value: string;
    icon?: string;
    link?: string;
}

const props = defineProps<CustomDropdownItemProps>();

const emit = defineEmits<{
    (e: 'select', event: Event): void,
}>();

const {
    value,
    icon,
    link,
    ...itemProps
} = props;

</script>

<template>
    <DropdownMenuItem
        v-bind="itemProps"
        class="flex flex-row gap-2 items-center p-2 rounded-sm data-highlighted:bg-brand-muted leading-none select-none outline-none cursor-default"
        :text-value="value"
        :as-child="true"
        @select="emit('select', $event)">
        <component 
            :is="!!link ? RouterLink : 'button'"
            class="w-full"
            :type="!link"
            :to="link ?? undefined">
            <Icon v-if="icon" :name="icon" size="20" />
            {{ value }}
        </component>
    </DropdownMenuItem>
</template>