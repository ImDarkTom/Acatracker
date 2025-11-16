<script setup lang="ts">
import type { FetchError } from "ofetch";

import { InsertTask, type AssesmentSchema } from '~~/lib/db/schema';

const { $csrfFetch } = useNuxtApp()

const props = defineProps<{
    assesment: AssesmentSchema,
}>();

const submitError = ref('');
const isLoading = ref(false);
const isSubmitted = ref(false);

const { handleSubmit, errors, meta, setErrors } = useForm({
    validationSchema: toTypedSchema(InsertTask),
    initialValues: {
        assesment: props.assesment.id,
        completed: false,
    }
});

const emit = defineEmits<{
    (e: 'submitted'): void,
}>();

const onSubmit = handleSubmit(async (values) => {
    try {
        submitError.value = "";
        isLoading.value = true;

        await $csrfFetch("/api/tasks", {
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
        <DialogTrigger as-child>
            <slot>
                <AppBtnPrimary class="w-full">
                    <Icon name="material-symbols:add-task-rounded" size="18" />
                    Add Task
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
                    Add New Task
                </DialogTitle>
                <DialogDescription class="mt-2 mb-1">
                    Add a task for {{ assesment.name }}.
                </DialogDescription>
                <form class="flex flex-col gap-2" @submit.prevent="onSubmit">
                    <AppFormField 
                        label="Name" 
                        name="name" 
                        placeholder="e.g. Submit First Draft"
                        :disabled="isLoading" 
                        :error="errors.name" />
                    <AppFormField 
                        type="textarea"
                        label="Description" 
                        name="description" 
                        placeholder="(Optional)" 
                        :disabled="isLoading"
                        :error="errors.description" />
                    <AppFormField 
                        name="dueAt" 
                        label="Due date" 
                        type="date"
                        :disabled="isLoading"
                        :error="errors.dueAt" />
                    <AppFormField
                        name="completed"
                        label="Completed?"
                        type="checkbox"
                        :disabled="isLoading"
                        :error="errors.completed" />
                    <div class="flex justify-end mt-2">
                        <AppBtnPrimary type="submit" :disabled="isLoading">
                            <Icon v-if="!isLoading" name="material-symbols:add-rounded" />
                            <Icon v-else name="mdi:loading" class="animate-spin" />
                            Add
                        </AppBtnPrimary>
                    </div>
                </form>
                <div @mousedown.stop="handleInteract" >
                    <DialogClose
                        class="absolute p-2 top-4 right-4 inline-flex cursor-pointer rounded-full hover:bg-elevated active:shadow-brand-700 shadow-sm"
                        aria-label="Close">
                        <Icon name="material-symbols:close-rounded" size="20" />
                    </DialogClose>
                </div>
            </DialogContent>
        </DialogPortal>
    </DialogRoot>
</template>