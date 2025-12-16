<script setup lang="ts">
import { InsertAssesment } from '~~/lib/db/schema';
import AddModuleSideButton from './AddModuleSideButton.vue';

const { $csrfFetch } = useNuxtApp();
const assesmentsStore = useAssesmentsStore();
const modulesStore = useModuleStore();

const { modules } = storeToRefs(modulesStore);

onMounted(() => modulesStore.refresh());

const moduleOptions = computed<[number, string][]>(() => {
    return (modules.value || []).map((m) => [ m.id, m.name ]);
});

const { handleSubmit, errors, meta, setErrors } = useForm({
    validationSchema: toTypedSchema(InsertAssesment)
});

const { isOpen, isLoading, submitHandler, confirmBeforeExiting, submitError } = useEditDialogForm({ meta, handleSubmit });

const onSubmit = submitHandler(async (values) => {
    await $csrfFetch("/api/assesments", {
        method: 'POST',
        body: values,
    });

    assesmentsStore.refresh();
}, setErrors);
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
            Add a new assesment
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
                        optionsList: moduleOptions,
                        hintText: '(Select a Module)',
                        sideBtn: AddModuleSideButton,
                    }
                ]" />
        </template>
    </CustomDialog>
</template>