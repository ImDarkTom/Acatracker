<script setup lang="ts">
import { InsertAssessment } from '~~/lib/db/schema';
import AddModuleSideButton from './AddModuleSideButton.vue';

const { addAssessment } = useAssessmentsStore();
const modulesStore = useModuleStore();

onMounted(() => modulesStore.refresh());

const { handleSubmit, errors, meta, setErrors } = useForm({
    validationSchema: toTypedSchema(InsertAssessment)
});

const { isOpen, isLoading, submitHandler, confirmBeforeExiting, submitError } = useEditDialogForm({ meta, handleSubmit });

const onSubmit = submitHandler(addAssessment, setErrors);
</script>

<template>
    <CustomDialog v-model:isOpen="isOpen" :confirmBeforeExiting :submitError>
        <template #button>
            <slot>
                <ButtonPrimary class="p-4 w-full px-auto">
                    <Icon name="material-symbols:create-new-folder-outline" />
                    Add Module
                </ButtonPrimary>
            </slot>
        </template>
        <template #title>
            Add a new assessment
        </template>
        <template #description>
            This can be an assignment, exam date, project due date, etc.
        </template>
        <template #form>
            <DynamicForm 
                :onSubmit 
                :isLoading
                :errors
                :submitBtn="{
                    icon: 'material-symbols:add-rounded',
                    label: 'Add'
                }"
                :fields="[
                    {
                        name: 'name',
                        label: 'Name',
                        as: 'input',
                        type: 'text',
                        placeholder: 'e.g. Important Exam',
                    },
                    {
                        name: 'description',
                        label: 'Description',
                        as: 'textarea',
                        type: 'text',
                        placeholder: '(Optional)'
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