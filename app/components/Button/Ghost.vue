<script setup lang="ts">
withDefaults(defineProps<{
    layer: 'base' | 'surface' | 'elevated' | 'overlay',
    highlightOnOpen?: boolean;
}>(), {
    highlightOnOpen: true,
});
</script>

<template>
    <button class="
        flex flex-row gap-1 items-center rounded-md p-2 font-medium
        not-disabled:cursor-pointer
        disabled:opacity-50
        transition-all duration-75"
        :class="{
            'not-disabled:hover:bg-bg-base-hover not-disabled:active:bg-bg-base-active!': layer === 'base',
            'data-[state=open]:bg-bg-base-active!': layer === 'base' && highlightOnOpen,

            'not-disabled:hover:bg-bg-surface-hover not-disabled:active:bg-bg-surface-active!': layer === 'surface',
            'data-[state=open]:bg-bg-surface-active!': layer === 'surface' && highlightOnOpen,

            'not-disabled:hover:bg-bg-elevated-hover not-disabled:active:bg-bg-elevated-active!': layer === 'elevated',
            'data-[state=open]:bg-bg-elevated-active!': layer === 'elevated' && highlightOnOpen,

            'not-disabled:hover:bg-bg-overlay-hover not-disabled:active:bg-bg-overlay-active!': layer === 'overlay',
            'data-[state=open]:bg-bg-overlay-active!': layer === 'overlay' && highlightOnOpen
        }">
        <slot />
    </button>
</template>