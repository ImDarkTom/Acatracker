<script setup lang="ts">
import { InsertTask, type AssessmentSchema, type TaskSchema } from '~~/lib/db/schema';
import unixTimestampToISO from '#shared/utils/unixTimestampToISO';

const { editTask } = useTaskStore();

const props = defineProps<{
    assessment: AssessmentSchema,
    task: TaskSchema,
}>();

const initialValues = {
    assessment: props.assessment.id,
    completed: props.task.completed,
    name: props.task.name,
    description: props.task.description,
    dueAt: props.task.dueAt,
}

const { handleSubmit, errors, meta, setErrors, resetForm } = useForm({
    validationSchema: toTypedSchema(InsertTask),
    initialValues,
});

const { isOpen, isLoading, submitHandler, confirmBeforeExiting, submitError } = useEditDialogForm({ meta, handleSubmit });

watch(isOpen, (justOpened) => {
    if (justOpened) {
        resetForm();
    };
});

const onSubmit = submitHandler(async (values) => editTask(values, props.task.id), setErrors);
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
            Editing task for {{ assessment.name }}.
        </template>
        <template #form>
            <DynamicForm 
                :onSubmit 
                :isLoading
                :errors
                :submitBtn="{
                    icon: 'material-symbols:edit-outline-rounded',
                    label: 'Edit'
                }"
                :fields="[
                    {
                        name: 'name',
                        label: 'Name',
                        as: 'input',
                        type: 'text',
                        placeholder: task.name,
                    },
                    {
                        name: 'description',
                        label: 'Description',
                        as: 'textarea',
                        type: 'text',
                        placeholder: task.description ?? '(Optional)'
                    },
                    {
                        name: 'dueAt',
                        label: 'Due Date',
                        as: 'input',
                        type: 'date',
                        value: unixTimestampToISO(initialValues.dueAt)
                    },
                    {
                        name: 'completed',
                        label: 'Completed',
                        as: 'input',
                        type: 'checkbox'
                    },
                ]" />
        </template>
    </CustomDialog>
</template>