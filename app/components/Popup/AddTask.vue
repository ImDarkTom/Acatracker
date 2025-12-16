<script setup lang="ts">
import { InsertTask, type AssesmentSchema } from '~~/lib/db/schema';

const { $csrfFetch } = useNuxtApp()
const taskStore = useTaskStore();

const props = defineProps<{
    assesment: AssesmentSchema,
}>();

const { handleSubmit, errors, meta, setErrors } = useForm({
    validationSchema: toTypedSchema(InsertTask),
    initialValues: {
        assesment: props.assesment.id,
        completed: false,
    }
});

const { isOpen, isLoading, submitHandler, confirmBeforeExiting, submitError } = useEditDialogForm({ meta, handleSubmit });

const onSubmit = submitHandler(async (values) => {
        await $csrfFetch("/api/tasks", {
            method: 'POST',
            body: values,
        });

        taskStore.refresh();
}, setErrors);
</script>

<template>
    <CustomDialog v-model:isOpen="isOpen" :confirmBeforeExiting :submitError>
        <template #button>
            <slot>
                <ButtonPrimary class="w-full">
                    <Icon name="material-symbols:add-task-rounded" size="18" />
                    Add Task
                </ButtonPrimary>
            </slot>
        </template>
        <template #title>
            Add New Task
        </template>
        <template #description>
            Add a task for {{ assesment.name }}.
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
                        placeholder: 'e.g. Submit First Draft',
                    },
                    {
                        name: 'description',
                        label: 'Description',
                        as: 'textarea',
                        type: 'text',
                        placeholder: '(Optional)'
                    },
                    {
                        name: 'dueAt',
                        label: 'Due Date',
                        as: 'input',
                        type: 'date'
                    },
                    {
                        name: 'completed',
                        label: 'Completed',
                        as: 'input',
                        type: 'checkbox'
                    },
                ]" />
        </template>
    </CustomDialog>
</template>