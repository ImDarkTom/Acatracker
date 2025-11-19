<script setup lang="ts">
import { InsertAssesment, type AssesmentSchema } from '~~/lib/db/schema';

const props = defineProps<{
    assesment: AssesmentSchema,
}>();

const { $csrfFetch } = useNuxtApp()
const modulesStore = useModuleStore();

const { handleSubmit, errors, meta, setErrors } = useForm({
    validationSchema: toTypedSchema(InsertAssesment),
    initialValues: {
        name: props.assesment.name,
        description: props.assesment.description,
        module: props.assesment.module,
        releasedAt: props.assesment.releasedAt,
        dueAt: props.assesment.dueAt,
    }
});

const { isOpen, isLoading, handleInteract, submitHandler } = useEditDialogForm({ meta, handleSubmit });

watch(isOpen, (newVal) => {
    // When dialog is opened, refresh the modules list we can choose from.
    if (newVal) modulesStore.refresh();
});

const emit = defineEmits<{
    (e: 'submitted'): void,
}>();

const { modules } = storeToRefs(modulesStore);

const onSubmit = submitHandler(async (values) => {
    await $csrfFetch(`/api/assesments/${props.assesment.id}`, {
        method: 'PUT',
        body: values,
    });
    emit('submitted');
}, setErrors);
</script>

<template>
    <DialogRoot v-model:open="isOpen">
        <DialogTrigger as-child>
            <slot />
        </DialogTrigger>
        <DialogPortal>
            <DialogOverlay class="bg-black/35 fixed inset-0 z-30" />
            <DialogContent @escape-key-down="handleInteract" @pointer-down-outside="handleInteract"
                class="p-4 bg-base fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[85vh] h- w-md max-w-full rounded-lg shadow-md shadow-black z-100">
                <DialogTitle class="text-lg font-semibold text-brand-100">
                    Editing {{ assesment.name }}
                </DialogTitle>
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
                        <PopupAddModule>
                            <AppBtnPrimary @click.prevent>
                                <Icon name="material-symbols:add" size="18" />
                            </AppBtnPrimary>
                        </PopupAddModule>
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
                            <Icon v-if="!isLoading" name="material-symbols:edit-outline-rounded" />
                            <LoadingIcon v-else />
                            Edit
                        </AppBtnPrimary>
                    </div>
                </form>
                <div @mousedown.stop="handleInteract">
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