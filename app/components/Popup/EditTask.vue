<script setup lang="ts">
import { InsertTask } from '~~/lib/db/schema';
import unixTimestampToISO from '#shared/utils/unixTimestampToISO';

const scheduleStore = useScheduleStore();

// TODO: replace task with just an id since we cal select from the assessment prop
const props = defineProps<{
    assessment: AssessmentWithTasks,
    task: AssessmentWithTasks['tasks'][number],
}>();

const initialValues: InsertTask = {
    assessmentId: props.assessment.id,
    isCompleted: props.task.isCompleted,
    name: props.task.name,
    description: props.task.description ?? undefined,
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
                        required: true,
                    },
                    {
                        name: 'description',
                        label: 'Description',
                        as: 'textarea',
                        type: 'text',
                        placeholder: task.description ?? 'e.g. This needs to include...',
                        required: true,
                    },
                    {
                        name: 'dueAt',
                        label: 'Due Date',
                        as: 'input',
                        type: 'datetime-local',
                        value: unixTimestampToISO(initialValues.dueAt),
                        max: unixTimestampToISO(assessment.dueAt),
                        min: assessment.releasedAt ? unixTimestampToISO(assessment.releasedAt) : undefined,
                        required: true,
                    },
                    {
                        name: 'isCompleted',
                        label: 'Completed?',
                        as: 'input',
                        type: 'checkbox'
                    },
                ]" />
        </template>
    </CustomDialog>
</template>