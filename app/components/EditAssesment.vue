<script setup lang="ts">
import type { FetchError } from "ofetch";

import { InsertAssesment, type AssesmentSchema } from '~~/lib/db/schema';

const { $csrfFetch } = useNuxtApp()

const props = defineProps<{
    assesment: AssesmentSchema,
}>();

const submitError = ref('');
const isLoading = ref(false);
const isSubmitted = ref(false);

const { handleSubmit, errors, meta, setErrors } = useForm({
    validationSchema: toTypedSchema(InsertAssesment)
});

const emit = defineEmits<{
    (e: 'submitted'): void,
}>();

const onSubmit = handleSubmit(async (values) => {
    try {
        submitError.value = "";
        isLoading.value = true;
        await $csrfFetch(`/api/assesments/${props.assesment.id}`, {
            method: 'PUT',
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

const modulesStore = useModuleStore();
const { modules } = storeToRefs(modulesStore);

watch(open, (newVal) => {
    if (newVal) modulesStore.refresh();
});
</script>

<template>
    <DialogRoot v-model:open="open">
        <DialogTrigger as-child>
            <slot />
        </DialogTrigger>
        <DialogPortal>
            <DialogOverlay class="bg-black/35 fixed inset-0 z-30" />
            <DialogContent @escape-key-down="handleInteract" @pointer-down-outside="handleInteract"
                class="p-4 bg-base fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[85vh] h- w-md max-w-full rounded-lg shadow-md shadow-black z-100">
                <DialogTitle class="text-lg font-semibold text-brand-100">
                    Edit Assesment
                </DialogTitle>
                <DialogDescription class="mt-2 mb-1">
                    Edit {{ assesment.name }}.
                </DialogDescription>
                <form class="flex flex-col gap-2" @submit.prevent="onSubmit">
                    <AppFormField 
                        label="Name" 
                        name="name" 
                        :placeholder="assesment.name"
                        :disabled="isLoading" 
                        :error="errors.name" />
                    <AppFormField 
                        type="textarea"
                        label="Description" 
                        name="description" 
                        :placeholder="assesment.description || undefined" 
                        :disabled="isLoading"
                        :error="errors.description" />
                    <div class="flex flex-row gap-2 items-end">
                        <AppFormFieldSelect
                            class="w-full"
                            name="module" 
                            label="Module"
                            :disabled="isLoading"
                            :errors="errors.module">
                            <option value="" disabled selected>(select a module)</option>
                            <option v-for="module in modules" :value="module.id">{{ module.name }}</option>
                        </AppFormFieldSelect>
                        <AddModule @submitted="modulesStore.refresh">
                            <AppBtnPrimary @click.prevent>
                                <Icon name="bi:plus" size="18" />
                            </AppBtnPrimary>
                        </AddModule>
                    </div>
                    <AppFormField 
                        name="releasedAt" 
                        label="Release date (optional)" 
                        type="date"
                        :disabled="isLoading"
                        :error="errors.releasedAt" />
                    <AppFormField 
                        name="dueAt" 
                        label="Due date" 
                        type="date"
                        :disabled="isLoading"
                        :error="errors.dueAt" />
                    <div class="flex justify-end mt-2">
                        <AppBtnPrimary type="submit" :disabled="isLoading">
                            <Icon v-if="!isLoading" name="bi:pen" />
                            <Icon v-else name="mdi:loading" class="animate-spin" />
                            Edit
                        </AppBtnPrimary>
                    </div>
                </form>
                <div @mousedown.stop="handleInteract">
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