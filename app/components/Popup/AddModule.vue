<script setup lang="ts">
import { InsertModule } from '~~/lib/db/schema';

const scheduleStore = useScheduleStore();
const preferencesStore = useUserPreferencesStore();
const { preferences } = storeToRefs(preferencesStore);

const { handleSubmit, errors, meta, setErrors, resetForm } = useForm({
    validationSchema: toTypedSchema(InsertModule),
    initialValues: {
        year: preferences.value?.currentYear,
        semester: preferences.value?.currentSemester,
    }
});

const { isOpen, isLoading, submitHandler, confirmBeforeExiting, submitError } = useEditDialogForm({ meta, handleSubmit });

const onSubmit = submitHandler(scheduleStore.module.add, setErrors);

watch(isOpen, (newValue) => {
    if (newValue) {
        resetForm({
            values: {
                year: preferences.value?.currentYear,
                semester: preferences.value?.currentSemester,
            }
        });
    }
});
</script>

<template>
    <template v-if="!preferences">
        Failed to load preferences. Reload the page and try again
    </template>
    <template v-else>
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
                Creating a new module for year {{ preferences.currentYear }}, semester {{ preferences.currentSemester }}.
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
                    ]" />
            </template>
        </CustomDialog>
    </template>
</template>