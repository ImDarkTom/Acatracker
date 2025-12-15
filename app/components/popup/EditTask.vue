<script setup lang="ts">
import { InsertTask, type AssesmentSchema, type TaskSchema } from '~~/lib/db/schema';

const { $csrfFetch } = useNuxtApp();
const tasksStore = useTaskStore();

const props = defineProps<{
    assesment: AssesmentSchema,
    task: TaskSchema,
}>();

const { handleSubmit, errors, meta, setErrors, resetForm } = useForm({
    validationSchema: toTypedSchema(InsertTask),
    initialValues: {
        assesment: props.assesment.id,
        completed: props.task.completed,
        name: props.task.name,
        description: props.task.description,
        dueAt: props.task.dueAt,
    }
});

const { isOpen, isLoading, submitHandler, confirmBeforeExiting, submitError } = useEditDialogForm({ meta, handleSubmit });

watch(isOpen, (justOpened) => {
    if (justOpened) {
        resetForm();
    };
});

const onSubmit = submitHandler(async (values) => {
        await $csrfFetch(`/api/tasks/${props.task.id}`, {
            method: 'PUT',
            body: values,
        });
        tasksStore.refresh()
}, setErrors);
</script>

<template>
    <CustomDialog v-model:isOpen="isOpen" :confirmBeforeExiting :submitError>
        <template #button>
            <slot />
        </template>
        <template #title>
            Edit task {{ task.name }}
        </template>
        <template #description>
            Editing task for {{ assesment.name }}.
        </template>
        <template #form>
            <form class="flex flex-col gap-2" @submit.prevent="onSubmit">
                <AppFormField 
                    label="Name" 
                    name="name" 
                    :placeholder="task.name"
                    :disabled="isLoading" 
                    :error="errors.name" />
                <AppFormField 
                    type="textarea"
                    label="Description" 
                    name="description" 
                    :placeholder="task.description ?? ''" 
                    :disabled="isLoading"
                    :error="errors.description" />
                <AppFormField 
                    name="dueAt" 
                    label="Due date" 
                    type="date"
                    :disabled="isLoading"
                    :error="errors.dueAt" />
                <div class="flex justify-end mt-2">
                    <ButtonPrimary type="submit" :disabled="isLoading">
                        <Icon v-if="!isLoading" name="material-symbols:edit-outline-rounded" />
                        <LoadingIcon v-else />
                        Edit
                    </ButtonPrimary>
                </div>
            </form>
        </template>
    </CustomDialog>
</template>