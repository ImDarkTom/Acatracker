<script setup lang="ts">
import { InsertAssesment, type AssesmentSchema } from '~~/lib/db/schema';

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

const { modules } = storeToRefs(modulesStore);

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
            <form class="flex flex-col gap-2" @submit.prevent="onSubmit">
                <AppFormField 
                    label="Name" 
                    name="name" 
                    :placeholder="assesment.name"
                    :disabled="isLoading" 
                    :error="errors.name" />
                <AppFormField 
                    type="textarea"
                    label="Description" 
                    name="description" 
                    :placeholder="assesment.description || undefined" 
                    :disabled="isLoading"
                    :error="errors.description" />
                <div class="flex flex-row gap-2 items-end">
                    <AppFormFieldSelect
                        class="w-full"
                        name="module" 
                        label="Module"
                        :disabled="isLoading"
                        :errors="errors.module">
                        <option value="" disabled selected>(select a module)</option>
                        <option v-for="module in modules" :value="module.id">{{ module.name }}</option>
                    </AppFormFieldSelect>
                    <PopupAddModule>
                        <ButtonPrimary @click.prevent>
                            <Icon name="material-symbols:add" size="18" />
                        </ButtonPrimary>
                    </PopupAddModule>
                </div>
                <AppFormField 
                    name="releasedAt" 
                    label="Release date (optional)" 
                    type="date"
                    :disabled="isLoading"
                    :error="errors.releasedAt" />
                <AppFormField 
                    name="dueAt" 
                    label="Due date" 
                    type="date"
                    :disabled="isLoading"
                    :error="errors.dueAt" />
                <div class="flex justify-end mt-2">
                    <ButtonPrimary type="submit" :disabled="isLoading">
                        <Icon v-if="!isLoading" name="material-symbols:edit-outline-rounded" />
                        <LoadingIcon v-else />
                        Edit
                    </ButtonPrimary>
                </div>
            </form>
        </template>
    </CustomDialog>
</template>