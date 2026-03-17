<script setup lang="ts">
import { InsertTask } from '~~/lib/db/schema';

const scheduleStore = useScheduleStore();

const props = defineProps<{
    assessment: AssessmentWithTasks,
}>();

const { handleSubmit, errors, meta, setErrors } = useForm({
    validationSchema: toTypedSchema(InsertTask),
    initialValues: {
        assessmentId: props.assessment.id,
        isCompleted: false,
    }
});

const { isOpen, isLoading, submitHandler, confirmBeforeExiting, submitError } = useEditDialogForm({ meta, handleSubmit });

const onSubmit = submitHandler(scheduleStore.task.add, setErrors);
</script>

<template>
    <CustomDialog v-model:isOpen="isOpen" :confirmBeforeExiting :submitError>
        <template #button>
            <slot />
        </template>
        <template #title>
            Add New Task
        </template>
        <template #description>
            Add a task for {{ assessment.name }}.
        </template>
        <template #form>
            <DynamicForm 
                :onSubmit 
                :isLoading
                :errors
                :submitBtn="{
                    icon: 'lucide:plus',
                    label: 'Add'
                }"
                :fields="[
                    {
                        name: 'name',
                        label: 'Name',
                        as: 'input',
                        type: 'text',
                        placeholder: 'e.g. Submit First Draft',
                    },
                    {
                        name: 'description',
                        label: 'Description',
                        as: 'textarea',
                        type: 'text',
                        placeholder: '(Optional)'
                    },
                    {
                        name: 'dueAt',
                        label: 'Due Date',
                        as: 'input',
                        type: 'datetime-local',
                        max: unixTimestampToISO(assessment.dueAt),
                        min: assessment.releasedAt ? unixTimestampToISO(assessment.releasedAt) : undefined,
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