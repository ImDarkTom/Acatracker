<script setup lang="ts">
withDefaults(defineProps<{
    layer?: 'app' | 'base',
    highlightOnOpen?: boolean;
}>(), {
    layer: 'base',
    highlightOnOpen: true,
});
</script>

<template>
    <button class="
        ring-1 ring-inset ring-highlight 
        flex flex-row gap-2 items-center rounded-md p-2 font-medium
        not-disabled:cursor-pointer 
        disabled:opacity-50
        transition-all duration-75"
        :class="{
            'bg-bg-base not-disabled:hover:bg-bg-base-hover not-disabled:active:bg-bg-base-active!': layer === 'app',
            'data-[state=open]:bg-bg-base-active!': layer === 'app' && highlightOnOpen,

            'bg-bg-elevated not-disabled:hover:bg-bg-elevated-hover not-disabled:active:bg-bg-elevated-active!': layer === 'base',
            'data-[state=open]:bg-bg-elevated-active!': layer === 'base' && highlightOnOpen
        }">
        <slot />
    </button>
</template>