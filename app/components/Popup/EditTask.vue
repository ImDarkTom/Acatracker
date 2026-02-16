<script setup lang="ts">
import { InsertTask } from '~~/lib/db/schema';
import unixTimestampToISO from '#shared/utils/unixTimestampToISO';
import type { AssessmentWithDetails } from '~~/lib/db/queries/assessments';
import type { AssessmentWithTasks } from '~~/lib/db/queries/modules';

const scheduleStore = useScheduleStore();

// TODO: replace task with just an id since we cal select from the assessment prop
const props = defineProps<{
    assessment: AssessmentWithTasks,
    task: AssessmentWithDetails['tasks'][number],
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

const onSubmit = submitHandler(async (values) => scheduleStore.task.update(values, props.task.id), setErrors);
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
                    icon: 'lucide:pencil',
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