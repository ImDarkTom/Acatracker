<script setup lang="ts">
import { InsertModule, type ModuleSchema } from '~~/lib/db/schema';

const { $csrfFetch } = useNuxtApp()

const props = defineProps<{
    module: ModuleSchema,
}>();

const { handleSubmit, errors, meta, setErrors } = useForm({
    validationSchema: toTypedSchema(InsertModule),
    initialValues: {
        code: props.module.code,
        name: props.module.name,
        semester: props.module.semester,
        year: props.module.year,
    },
});

const { isOpen, isLoading, handleInteract, submitHandler } = useEditDialogForm({ meta, handleSubmit });

const emit = defineEmits<{
    (e: 'submitted'): void,
}>();

const onSubmit = submitHandler(async (values) => {
    await $csrfFetch(`/api/modules/${props.module.id}`, {
        method: 'PUT',
        body: values,
    });
    emit('submitted');
}, setErrors)
</script>

<template>
    <DialogRoot v-model:open="isOpen">
        <DialogTrigger as-child>
            <slot />
        </DialogTrigger>
        <DialogPortal>
            <DialogOverlay class="bg-black/35 fixed inset-0 z-30" />
            <DialogContent
                @escape-key-down="handleInteract"
                @pointer-down-outside="handleInteract"
                class="p-4 bg-base fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[85vh] h- w-md max-w-full rounded-lg shadow-md shadow-black z-100">
                <DialogTitle class="text-lg font-semibold text-brand-100">
                    Update {{ module.name }}
                </DialogTitle>
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
                    <div class="flex flex-row gap-2 *:max-w-[calc(50%-0.25rem)]">
                        <AppFormField 
                            type="number"
                            label="Year" 
                            name="year" 
                            placeholder="e.g. '1' for Year 1"
                            :disabled="isLoading"
                            :error="errors.year" />
                        <AppFormField
                            type="number"
                            label="Semester" 
                            name="semester" 
                            placeholder="e.g. '2' for Semester 2"
                            :disabled="isLoading"
                            :error="errors.semester" />
                    </div>
                    <div class="flex justify-end mt-2">
                        <AppBtnPrimary type="submit" :disabled="isLoading">
                            <Icon v-if="!isLoading" name="material-symbols:add-rounded" />
                            <LoadingIcon v-else />
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