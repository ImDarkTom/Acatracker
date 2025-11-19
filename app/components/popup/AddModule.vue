<script setup lang="ts">
import { InsertModule } from '~~/lib/db/schema';
import LoadingIcon from '../LoadingIcon.vue';

const { $csrfFetch } = useNuxtApp();
const modulesStore = useModuleStore();

const { handleSubmit, errors, meta, setErrors } = useForm({
    validationSchema: toTypedSchema(InsertModule)
});

const { isOpen, isLoading, submitHandler, confirmBeforeExiting } = useEditDialogForm({ meta, handleSubmit });

const onSubmit = submitHandler(async (values) => {
    await $csrfFetch("/api/modules", {
        method: 'POST',
        body: values,
    });

    modulesStore.refresh();
}, setErrors);
</script>

<template>
    <CustomDialog v-model:isOpen="isOpen" :confirmBeforeExiting>
        <template #button>
            <AppBtnPrimary class="p-4 w-full px-auto">
                <Icon name="material-symbols:create-new-folder-outline" />
                Add Module
            </AppBtnPrimary>
        </template>
        <template #title>
            Add new module
        </template>
        <template #description>
            Create a new module to add assesments to.
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
                        <Icon v-if="!isLoading" name="material-symbols:add-rounded" />
                        <LoadingIcon v-else />
                        Add
                    </AppBtnPrimary>
                </div>
            </form>
        </template>
    </CustomDialog>
</template>