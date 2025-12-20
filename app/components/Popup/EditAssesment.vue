<script setup lang="ts">
import { InsertAssesment, type AssesmentSchema } from '~~/lib/db/schema';
import AddModuleSideButton from './AddModuleSideButton.vue';

const props = defineProps<{
    assesment: AssesmentSchema,
}>();

const { $csrfFetch } = useNuxtApp()
const modulesStore = useModuleStore();
const assesmentsStore = useAssesmentsStore();

const { handleSubmit, errors, meta, setErrors, resetForm } = useForm({
    validationSchema: toTypedSchema(InsertAssesment),
    initialValues: {
        name: props.assesment.name,
        description: props.assesment.description,
        module: props.assesment.module,
        releasedAt: props.assesment.releasedAt,
        dueAt: props.assesment.dueAt,
    }
});

const { isOpen, isLoading, submitHandler, confirmBeforeExiting, submitError } = useEditDialogForm({ meta, handleSubmit });

watch(isOpen, (justOpened) => {
    if (justOpened) {
        modulesStore.refresh();
        resetForm();
    };
});

const onSubmit = submitHandler(async (values) => {
    await $csrfFetch(`/api/assesments/${props.assesment.id}`, {
        method: 'PUT',
        body: values,
    });

    assesmentsStore.refresh();
}, setErrors);
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
            Editing {{ assesment.name }}
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
                        placeholder: assesment.name,
                    },
                    {
                        name: 'description',
                        label: 'Description',
                        as: 'textarea',
                        type: 'text',
                        placeholder: assesment.description ?? '(Optional)'
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