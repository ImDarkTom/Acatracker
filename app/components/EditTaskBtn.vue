<script setup lang="ts">
import { InsertTask, type AssesmentSchema, type TaskSchema } from '~~/lib/db/schema';

const { $csrfFetch } = useNuxtApp();
const tasksStore = useTaskStore();

const props = defineProps<{
    assesment: AssesmentSchema,
    task: TaskSchema,
}>();

const { handleSubmit, errors, meta, setErrors } = useForm({
    validationSchema: toTypedSchema(InsertTask),
    initialValues: {
        assesment: props.assesment.id,
        completed: props.task.completed,
        name: props.task.name,
        description: props.task.description,
        dueAt: props.task.dueAt,
    }
});

const { isOpen, isLoading, handleInteract, submitHandler } = useEditDialogForm({ meta, handleSubmit });

const onSubmit = submitHandler(async (values) => {
        await $csrfFetch(`/api/tasks/${props.task.id}`, {
            method: 'PUT',
            body: values,
        });
        tasksStore.refresh()
}, setErrors);
</script>

<template>
    <DialogRoot v-model:open="isOpen">
        <DialogTrigger as-child>
            <slot />
        </DialogTrigger>
        <DialogPortal>
            <DialogOverlay class="bg-black/35 fixed inset-0 z-30" />
            <DialogContent
                @escape-key-down="handleInteract"
                @pointer-down-outside="handleInteract"
                class="p-4 bg-base fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-h-[85vh] h- w-md max-w-full rounded-lg shadow-md shadow-black z-100">
                <DialogTitle class="text-lg font-semibold text-brand-100">
                    Edit task {{ task.name }}
                </DialogTitle>
                <DialogDescription class="mt-2 mb-1">
                    Editing task for {{ assesment.name }}.
                </DialogDescription>
                <form class="flex flex-col gap-2" @submit.prevent="onSubmit">
                    <AppFormField 
                        label="Name" 
                        name="name" 
                        :placeholder="task.name"
                        :disabled="isLoading" 
                        :error="errors.name" />
                    <AppFormField 
                        type="textarea"
                        label="Description" 
                        name="description" 
                        :placeholder="task.description ?? ''" 
                        :disabled="isLoading"
                        :error="errors.description" />
                    <AppFormField 
                        name="dueAt" 
                        label="Due date" 
                        type="date"
                        :disabled="isLoading"
                        :error="errors.dueAt" />
                    <div class="flex justify-end mt-2">
                        <AppBtnPrimary type="submit" :disabled="isLoading">
                            <Icon v-if="!isLoading" name="material-symbols:edit-outline-rounded" />
                            <Icon v-else name="mdi:loading" class="animate-spin" />
                            Edit
                        </AppBtnPrimary>
                    </div>
                </form>
                <div @mousedown.stop="handleInteract" >
                    <DialogClose
                        class="absolute p-2 top-4 right-4 inline-flex cursor-pointer rounded-full hover:bg-elevated active:shadow-brand-700 shadow-sm"
                        aria-label="Close">
                        <Icon name="material-symbols:close-rounded" size="20" />
                    </DialogClose>
                </div>
            </DialogContent>
        </DialogPortal>
    </DialogRoot>
</template>