<script setup lang="ts">
const props = defineProps<{
    isOpen: boolean,
    confirmBeforeExiting: boolean;
    submitError?: string;
}>();

const emit = defineEmits<{
    (e: 'update:isOpen', value: boolean): void,
}>();

const open = computed({
    get: () => props.isOpen,
    set: (value: boolean) => emit('update:isOpen', value),
});

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
    <DialogRoot v-model:open="open" v-bind="$attrs" v-slot="{ close: dialogClose }">
        <DialogTrigger as-child>
            <slot name="button" />
        </DialogTrigger>
        <DialogPortal>
            <Transition name="fade">
                <DialogOverlay class="bg-black/65 backdrop-blur-xs fixed inset-0 z-105" />
            </Transition>
            <Transition name="scale">
                <DialogContent
                    @escape-key-down="handleExitClick($event, dialogClose)"
                    @pointer-down-outside="handleExitClick($event, dialogClose)"
                    class="p-4 bg-base fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[85vh] h- w-md max-w-full rounded-lg shadow-md shadow-black/50 z-110">
                    <DialogTitle class="text-lg font-semibold text-brand-100">
                        <slot name="title" />
                    </DialogTitle>
                    <DialogDescription class="mt-2 mb-1">
                        <slot name="description" />
                    </DialogDescription>
                    <div v-if="submitError" class="bg-errorbg p-2 rounded-sm">
                        {{ submitError }}
                    </div>

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
            </Transition>
        </DialogPortal>
    </DialogRoot>
</template>