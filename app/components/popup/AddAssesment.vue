<script setup lang="ts">
import { InsertAssesment } from '~~/lib/db/schema';
import LoadingIcon from '../LoadingIcon.vue';
import { on } from 'events';

const { $csrfFetch } = useNuxtApp();
const assesmentsStore = useAssesmentsStore();
const modulesStore = useModuleStore();

const { modules } = storeToRefs(modulesStore);

onMounted(() => modulesStore.refresh());

const { handleSubmit, errors, meta, setErrors } = useForm({
    validationSchema: toTypedSchema(InsertAssesment)
});

const { isOpen, isLoading, submitHandler, confirmBeforeExiting, submitError } = useEditDialogForm({ meta, handleSubmit });

const onSubmit = submitHandler(async (values) => {
    await $csrfFetch("/api/assesments", {
        method: 'POST',
        body: values,
    });

    assesmentsStore.refresh();
}, setErrors);
</script>

<template>
    <CustomDialog v-model:isOpen="isOpen" :confirmBeforeExiting :submitError>
        <template #button>
            <slot>
                <AppBtnPrimary class="p-4 w-full px-auto">
                    <Icon name="material-symbols:create-new-folder-outline" />
                    Add Module
                </AppBtnPrimary>
            </slot>
        </template>
        <template #title>
            Add a new assesment
        </template>
        <template #description>
            This can be an assignment, exam date, project due date, etc.
        </template>
        <template #form>
            <form class="flex flex-col gap-2" @submit.prevent="onSubmit">
                <AppFormField 
                    name="name" 
                    label="Name"
                    placeholder="e.g. Important Exam"
                    :disabled="isLoading"
                    :error="errors.name" />
                <AppFormField 
                    name="description" 
                    label="Description" 
                    type="textarea" 
                    placeholder="(Optional)" 
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
                        <Icon v-if="!isLoading" name="material-symbols:add-rounded" />
                        <LoadingIcon v-else />
                        Add
                    </AppBtnPrimary>
                </div>
            </form>
        </template>
    </CustomDialog>
</template>