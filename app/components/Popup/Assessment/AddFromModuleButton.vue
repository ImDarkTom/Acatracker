<script setup lang="ts">
import { InsertAssessment } from '~~/lib/db/schema';

const props = defineProps<{
    forModuleId: number,
}>();

const { addAssessment } = useAssessmentsStore();
const modulesStore = useModuleStore();

onMounted(() => modulesStore.refresh());

const { handleSubmit, errors, meta, setErrors, resetForm } = useForm({
    validationSchema: toTypedSchema(InsertAssessment),
    initialValues: {
        module: props.forModuleId,
    },
});

const { isOpen, isLoading, submitHandler, confirmBeforeExiting, submitError } = useEditDialogForm({ meta, handleSubmit });

const onSubmit = submitHandler(addAssessment, setErrors);

watch(isOpen, (newValue) => {
    if (newValue) {
        resetForm({
            values: {
                module: props.forModuleId,
            }
        });
    }
});
</script>

<template>
    <CustomDialog v-model:isOpen="isOpen" :confirmBeforeExiting :submitError>
        <template #button>
            <slot />
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
                    icon: 'lucide:plus',
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
                    }
                ]" />
        </template>
    </CustomDialog>
</template>