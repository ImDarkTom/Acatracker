<script setup lang="ts">
import { InsertModule } from '~~/lib/db/schema';

const props = defineProps<{
    module: ModuleWithAssessments,
}>();

const scheduleStore = useScheduleStore();

const { handleSubmit, errors, meta, setErrors, resetForm } = useForm({
    validationSchema: toTypedSchema(InsertModule),
    initialValues: {
        code: props.module.code,
        name: props.module.name,
        semester: props.module.semester,
        year: props.module.year,
    },
});

const { isOpen, isLoading, submitHandler, confirmBeforeExiting, submitError } = useEditDialogForm({ meta, handleSubmit });

watch(isOpen, (justOpened) => {
    if (justOpened) {
        resetForm();
    };
});

const onSubmit = submitHandler(async (values) => scheduleStore.module.edit(values, props.module.id), setErrors)
</script>

<template>
    <CustomDialog v-model:isOpen="isOpen" :confirmBeforeExiting :submitError>
        <template #button>
            <slot />
        </template>
        <template #title>
            Edit Module 
        </template>
        <template #description>
            Editing {{ module.name }}
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
                        placeholder: module.name
                    },
                    {
                        name: 'code',
                        label: 'Course Code',
                        as: 'input',
                        type: 'text',
                        placeholder: module.code,
                    },
                    {
                        name: 'year',
                        label: 'Year',
                        as: 'input',
                        type: 'number',
                        placeholder: module.year,
                    },
                    {
                        name: 'semester',
                        label: 'Semester',
                        as: 'input',
                        type: 'number',
                        placeholder: module.semester,
                    }
                ]" />
        </template>
    </CustomDialog>
</template>