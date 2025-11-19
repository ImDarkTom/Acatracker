<script setup lang="ts">
import { InsertTask, type AssesmentSchema } from '~~/lib/db/schema';

const { $csrfFetch } = useNuxtApp()
const taskStore = useTaskStore();

const props = defineProps<{
    assesment: AssesmentSchema,
}>();

const { handleSubmit, errors, meta, setErrors } = useForm({
    validationSchema: toTypedSchema(InsertTask),
    initialValues: {
        assesment: props.assesment.id,
        completed: false,
    }
});

const { isOpen, isLoading, submitHandler, confirmBeforeExiting, submitError } = useEditDialogForm({ meta, handleSubmit });

const onSubmit = submitHandler(async (values) => {
        await $csrfFetch("/api/tasks", {
            method: 'POST',
            body: values,
        });

        taskStore.refresh();
}, setErrors);
</script>

<template>
    <CustomDialog v-model:isOpen="isOpen" :confirmBeforeExiting :submitError>
        <template #button>
            <slot>
                <AppBtnPrimary class="w-full">
                    <Icon name="material-symbols:add-task-rounded" size="18" />
                    Add Task
                </AppBtnPrimary>
            </slot>
        </template>
        <template #title>
            Add New Task
        </template>
        <template #description>
            Add a task for {{ assesment.name }}.
        </template>
        <template #form>
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
                        <LoadingIcon v-else />
                        Add
                    </AppBtnPrimary>
                </div>
            </form>
        </template>
    </CustomDialog>
</template>