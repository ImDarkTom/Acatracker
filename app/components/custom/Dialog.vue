<script setup lang="ts">
const props = defineProps<{
    confirmBeforeExiting: boolean;
}>();

function handleExitClick(e: Event, exitFn: () => void) {
    if (props.confirmBeforeExiting) {
        if (confirm('Are you sure you want to leave? All unsaved changes will be lost.')) {
            exitFn();
            return;
        } else {
            e.preventDefault();
            e.stopImmediatePropagation();
            return;
        }
    }

    exitFn();
}
</script>

<template>
    <DialogRoot v-bind="$attrs" v-slot="{ close: dialogClose }">
        <DialogTrigger as-child>
            <slot name="button" />
        </DialogTrigger>
        <DialogPortal>
            <DialogOverlay class="bg-black/35 fixed inset-0 z-30" />
            <DialogContent
                @escape-key-down="handleExitClick($event, dialogClose)"
                @pointer-down-outside="handleExitClick($event, dialogClose)"
                class="p-4 bg-base fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[85vh] h- w-md max-w-full rounded-lg shadow-md shadow-black z-100">
                <DialogTitle class="text-lg font-semibold text-brand-100">
                    <slot name="title" />
                </DialogTitle>
                <DialogDescription v-if="$slots.description" class="mt-2 mb-1">
                    <slot name="description" />
                </DialogDescription>

                <slot name="form" />

                <button
                    class="absolute top-4 right-4"
                    aria-label="Close"
                    @click="handleExitClick($event, dialogClose)">
                    <div class="inline-flex cursor-pointer rounded-full p-2 hover:bg-elevated active:shadow-brand-700 shadow-sm">
                        <Icon name="material-symbols:close-rounded" size="20" />
                    </div>
                </button>
            </DialogContent>
        </DialogPortal>
    </DialogRoot>
</template>