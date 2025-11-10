<script setup lang="ts">
import type { FetchError } from "ofetch";

import { InsertModule } from '~~/lib/db/schema';

const { $csrfFetch } = useNuxtApp()

const submitError = ref('');
const isLoading = ref(false);
const isSubmitted = ref(false);

const { handleSubmit, errors, meta, setErrors } = useForm({
    validationSchema: toTypedSchema(InsertModule)
});

const emit = defineEmits<{
    (e: 'submitted'): void,
}>();

const onSubmit = handleSubmit(async (values) => {
    try {
        submitError.value = "";
        isLoading.value = true;
        await $csrfFetch("/api/modules", {
            method: 'POST',
            body: values,
        });
        isSubmitted.value = true;
        open.value = false;
        emit('submitted');
    } catch (e) {
        const error = e as FetchError;
        if (error.data?.data) {
            setErrors(error.data.data);
        }
        submitError.value = error.data?.statusMessage || error.statusMessage || 'An unknown error occured.';
    }
    isLoading.value = false;
});

onBeforeRouteLeave(() => {
    if (!isSubmitted.value && meta.value.dirty) {
        const confirmed = confirm('Are you sure you want to leave? All unsaved changes will be lost.');
        if (!confirmed) {
            return false;
        }
    }
    return true;
});

const open = ref(false);

function handleInteract(event: Event) {
    event.preventDefault();

    if (!isSubmitted.value && meta.value.dirty) {
        if (confirm('Are you sure you want to leave? All unsaved changes will be lost.')) {
            open.value = false;
            return;
        }
    }
}

</script>

<template>
    <DialogRoot v-model:open="open">
        <DialogTrigger>
            <slot>
                <AppBtnPrimary class="p-4 w-full px-auto">
                    <Icon name="bi:plus" />
                    Add Module
                </AppBtnPrimary>
            </slot>
        </DialogTrigger>
        <DialogPortal>
            <DialogOverlay class="bg-black/35 fixed inset-0 z-30" />
            <DialogContent
                @escape-key-down="handleInteract"
                @pointer-down-outside="handleInteract"
                class="p-4 bg-base fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[85vh] h- w-md max-w-full rounded-lg shadow-md shadow-black z-100">
                <DialogTitle class="text-lg font-semibold text-brand-100">
                    Add new Module
                </DialogTitle>
                <DialogDescription class="mt-2 mb-1">
                    Create a new module to add assesments to.
                </DialogDescription>
                <form class="flex flex-col gap-2" @submit.prevent="onSubmit">
                    <AppFormField 
                        label="Name" 
                        name="name" 
                        placeholder="e.g. Object-Oriented Programming"
                        :disabled="isLoading"
                        :error="errors.name" />
                    <AppFormField 
                        label="Course Code" 
                        name="code" 
                        placeholder="e.g. OOP1234"
                        :disabled="isLoading"
                        :error="errors.code" />
                    <div class="flex justify-end mt-2">
                        <AppBtnPrimary type="submit" :disabled="isLoading">
                            <Icon v-if="!isLoading" name="bi:plus" />
                            <Icon v-else name="mdi:loading" class="animate-spin" />
                            Add
                        </AppBtnPrimary>
                    </div>
                </form>
                <div @mousedown.stop="handleInteract" >
                    <DialogClose
                        class="absolute top-4 right-4 inline-flex cursor-pointer rounded-full hover:bg-elevated active:shadow-brand-700 shadow-sm"
                        aria-label="Close">
                        <Icon name="bi:x" size="24" />
                    </DialogClose>
                </div>
            </DialogContent>
        </DialogPortal>
    </DialogRoot>
</template>