<script setup lang="ts">
import { InsertAssessment } from '~~/lib/db/schema';
import AddModuleSideButton from './AddModuleSideButton.vue';
import unixTimestampToISO from '#shared/utils/unixTimestampToISO';
import type { AssessmentWithoutId } from '~~/lib/db/queries/modules';

const props = defineProps<{
    assessment: AssessmentWithoutId,
}>();

const scheduleStore = useScheduleStore();

const initialValues = {
    name: props.assessment.name,    
    description: props.assessment.description,
    module: props.assessment.moduleId,
    releasedAt: props.assessment.releasedAt,
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
                    },
                    {
                        name: 'description',
                        label: 'Description',
                        as: 'textarea',
                        type: 'text',
                        placeholder: assessment.description ?? '(Optional)'
                    },
                    {
                        name: 'releasedAt',
                        label: 'Release Date (optional)',
                        as: 'input',
                        type: 'date',
                        value: initialValues.releasedAt ? unixTimestampToISO(initialValues.releasedAt) : undefined,
                    },
                    {
                        name: 'dueAt',
                        label: 'Due Date',
                        as: 'input',
                        type: 'date',
                        value: unixTimestampToISO(initialValues.dueAt),
                    },
                    {
                        name: 'module',
                        label: 'Module',
                        as: 'select',
                        groups: scheduleStore.moduleSelectorOptions,
                        hintText: '(Select a Module)',
                        sideBtn: AddModuleSideButton,
                    }
                ]" />
        </template>
    </CustomDialog>
</template>