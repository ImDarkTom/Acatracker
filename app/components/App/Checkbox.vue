<script setup lang="ts">
const checked = defineModel<boolean>('checked', {
    default: false,
});
</script>

<template>
    <CheckboxRoot 
        v-model="checked"
        class="
            bg-bg-elevated hover:bg-bg-elevated-hover active:bg-bg-elevated-active 
            ring-1 ring-inset ring-highlight 
            size-6 rounded-md cursor-pointer
            data-[state=checked]:bg-brand-base data-[state=checked]:hover:bg-brand-active
            data-[state=checked]:text-text-primary
            transition-colors duration-75">
        <CheckboxIndicator
            class="flex items-center justify-center mt-0.5">
            <Icon
                name="lucide:check"
                size="20" />
        </CheckboxIndicator>
    </CheckboxRoot>
</template>