<script setup lang="ts">
import { InsertModule, type ModuleSchema } from '~~/lib/db/schema';

const { $csrfFetch } = useNuxtApp();
const modulesStore = useModuleStore();

const props = defineProps<{
    module: ModuleSchema,
}>();

const { handleSubmit, errors, meta, setErrors, resetForm } = useForm({
    validationSchema: toTypedSchema(InsertModule),
    initialValues: {
        code: props.module.code,
        name: props.module.name,
        semester: props.module.semester,
        year: props.module.year,
    },
});

const { isOpen, isLoading, submitHandler, confirmBeforeExiting, submitError } = useEditDialogForm({ meta, handleSubmit });

watch(isOpen, (justOpened) => {
    if (justOpened) {
        resetForm();
    };
});

const onSubmit = submitHandler(async (values) => {
    await $csrfFetch(`/api/modules/${props.module.id}`, {
        method: 'PUT',
        body: values,
    });

    modulesStore.refresh();
}, setErrors)
</script>

<template>
    <CustomDialog v-model:isOpen="isOpen" :confirmBeforeExiting :submitError>
        <template #button>
            <slot />
        </template>
        <template #title>
            Edit Module 
        </template>
        <template #description>
            Editing {{ module.name }}
        </template>
        <template #form>
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
                            <Icon v-if="!isLoading" name="material-symbols:edit-outline-rounded" />
                            <LoadingIcon v-else />
                            Edit
                        </AppBtnPrimary>
                    </div>
                </form>
        </template>
    </CustomDialog>
</template>