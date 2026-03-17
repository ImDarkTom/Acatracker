<script setup lang="ts">
import { InsertAssessment } from '~~/lib/db/schema';
import unixTimestampToISO from '#shared/utils/unixTimestampToISO';

const props = defineProps<{
    assessment: AssessmentWithTasks,
}>();

const scheduleStore = useScheduleStore();

const initialValues: InsertAssessment = {
    name: props.assessment.name,    
    description: props.assessment.description ?? undefined,
    moduleId: props.assessment.moduleId,
    releasedAt: props.assessment.releasedAt ?? undefined,
    dueAt: props.assessment.dueAt,
}

const { handleSubmit, errors, meta, setErrors, resetForm } = useForm({
    validationSchema: toTypedSchema(InsertAssessment),
    initialValues,
});

const { isOpen, isLoading, submitHandler, confirmBeforeExiting, submitError } = useEditDialogForm({ meta, handleSubmit });

const onSubmit = submitHandler(
    async (values) => scheduleStore.assessment.update(props.assessment.slug, values), 
    setErrors
);

watch(isOpen, (justOpened) => {
    if (justOpened) {
        resetForm();
    };
});
</script>

<template>
    <CustomDialog v-model:isOpen="isOpen" :confirmBeforeExiting :submitError>
        <template #button>
            <slot />
        </template>
        <template #title>
            Edit assessment
        </template>
        <template #description>
            Editing {{ assessment.name }}
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
                        placeholder: assessment.name,
                        required: true,
                    },
                    {
                        name: 'description',
                        label: 'Description',
                        as: 'textarea',
                        type: 'text',
                        placeholder: assessment.description ?? 'e.g. Sections are divided into...',
                    },
                    {
                        name: 'releasedAt',
                        label: 'Release Date',
                        as: 'input',
                        type: 'datetime-local',
                        value: initialValues.releasedAt ? unixTimestampToISO(initialValues.releasedAt) : undefined,
                    },
                    {
                        name: 'dueAt',
                        label: 'Due Date',
                        as: 'input',
                        type: 'datetime-local',
                        value: unixTimestampToISO(initialValues.dueAt),
                        required: true,
                    },
                ]" />
        </template>
    </CustomDialog>
</template>