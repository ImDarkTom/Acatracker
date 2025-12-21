<script setup lang="ts">
import { InsertAssessment, type AssessmentSchema } from '~~/lib/db/schema';
import AddModuleSideButton from './AddModuleSideButton.vue';

const props = defineProps<{
    assessment: AssessmentSchema,
}>();

const modulesStore = useModuleStore();
const { editAssessment } = useAssessmentsStore();

const { handleSubmit, errors, meta, setErrors, resetForm } = useForm({
    validationSchema: toTypedSchema(InsertAssessment),
    initialValues: {
        name: props.assessment.name,
        description: props.assessment.description,
        module: props.assessment.module,
        releasedAt: props.assessment.releasedAt,
        dueAt: props.assessment.dueAt,
    }
});

const { isOpen, isLoading, submitHandler, confirmBeforeExiting, submitError } = useEditDialogForm({ meta, handleSubmit });

const onSubmit = submitHandler(async (values) => editAssessment(values, props.assessment.id), setErrors);

watch(isOpen, (justOpened) => {
    if (justOpened) {
        modulesStore.refresh();
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
                    icon: 'material-symbols:edit-outline-rounded',
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
                        type: 'date'
                    },
                    {
                        name: 'dueAt',
                        label: 'Due Date',
                        as: 'input',
                        type: 'date'
                    },
                    {
                        name: 'module',
                        label: 'Module',
                        as: 'select',
                        optionsList: modulesStore.moduleSelectorOptions,
                        hintText: '(Select a Module)',
                        sideBtn: AddModuleSideButton,
                    }
                ]" />
        </template>
    </CustomDialog>
</template>