<script setup lang="ts">
import { InsertModule } from '~~/lib/db/schema';

const scheduleStore = useScheduleStore();
const preferencesStore = useUserPreferencesStore();
const { preferences } = storeToRefs(preferencesStore);

const { handleSubmit, errors, meta, setErrors } = useForm({
    validationSchema: toTypedSchema(InsertModule),
    initialValues: {
        year: preferences.value?.currentYear,
        semester: preferences.value?.currentSemester,
    }
});

const { isOpen, isLoading, submitHandler, confirmBeforeExiting, submitError } = useEditDialogForm({ meta, handleSubmit });

const onSubmit = submitHandler(scheduleStore.module.add, setErrors);
</script>

<template>
    <CustomDialog 
        v-model:isOpen="isOpen" 
        :confirmBeforeExiting 
        :submitError 
        :priority="2">
        <template #button>
            <slot />
        </template>
        <template #title>
            Add new module
        </template>
        <template #description>
            Create a new module to add assessments to.
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
                        placeholder: 'e.g. Object-Oriented Programming'
                    },
                    {
                        name: 'code',
                        label: 'Course Code',
                        as: 'input',
                        type: 'text',
                        placeholder: 'e.g. OOP1234',
                    },
                    {
                        name: 'year',
                        label: 'Year',
                        as: 'input',
                        type: 'number',
                        placeholder: 'e.g. \'1\' for Year 1',
                    },
                    {
                        name: 'semester',
                        label: 'Semester',
                        as: 'input',
                        type: 'number',
                        placeholder: 'e.g. \'2\' for Semester 1',
                    }
                ]" />
        </template>
    </CustomDialog>
</template>