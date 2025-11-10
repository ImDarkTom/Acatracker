<script setup lang="ts">
import type { FetchError } from "ofetch";

import { InsertAssesment } from '~~/lib/db/schema';

const { $csrfFetch } = useNuxtApp()

const submitError = ref('');
const isLoading = ref(false);
const isSubmitted = ref(false);

const { handleSubmit, errors, meta, setErrors } = useForm({
    validationSchema: toTypedSchema(InsertAssesment)
});

const onSubmit = handleSubmit(async (values) => {
    try {
        submitError.value = "";
        isLoading.value = true;
        await $csrfFetch("/api/assesments", {
            method: 'POST',
            body: values,
        });
        isSubmitted.value = true;
        navigateTo('/dashboard');
    } catch (e) {
        const error = e as FetchError;
        if (error.data?.data) {
            setErrors(error.data.data);
        }
        submitError.value = error.data?.statusMessage || error.statusMessage || 'An unknown error occured.';
    }
    isLoading.value = false;
});

onBeforeRouteLeave(() => {
    if (!isSubmitted.value && meta.value.dirty) {
        const confirmed = confirm('Are you sure you want to leave? All unsaved changes will be lost.');
        if (!confirmed) {
            return false;
        }
    }
    return true;
});

const modulesStore = useModuleStore();
const { modules } = storeToRefs(modulesStore);

onMounted(() => modulesStore.refresh());

</script>

<template>
    <div class="max-w-md mx-auto">
        <h1 class="text-xl">Add a new assesment</h1>
        <p>This can be an assignment, exam date, project due date, etc.</p>
        <br>
        <div v-if="submitError" class="bg-errorbg p-2">
            {{ submitError }}
        </div>
        <form class="flex flex-col gap-2" @submit.prevent="onSubmit">
            <AppFormField 
                name="name" 
                label="Name"
                placeholder="e.g. Important Exam"
                :disabled="isLoading"
                :error="errors.name" />
            <AppFormField 
                name="description" 
                label="Description" 
                type="textarea" 
                placeholder="(Optional)" 
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
                <AddModule @submitted="modulesStore.refresh">
                    <AppBtnPrimary @click.prevent>
                        <Icon name="bi:plus" size="18" />
                    </AppBtnPrimary>
                </AddModule>
            </div>
            <AppFormField 
                name="dueAt" 
                label="Due" 
                type="date"
                :disabled="isLoading"
                :error="errors.dueAt" />
            <div class="flex flex-row justify-between" :class="{ 'opacity-50': isLoading }">
                <AppBtnPrimary :disabled="isLoading" type="button" class="bg-base!" @click="$router.back()">
                    <Icon name="bi:arrow-left" size="24"/>
                    Back
                </AppBtnPrimary>
                <AppBtnPrimary :disabled="isLoading" type="submit">
                    <Icon v-if="isLoading" name="mdi:loading" class="animate-spin" size="24" />
                    <Icon v-else name="bi:plus" size="24"/>
                    Add
                </AppBtnPrimary>
            </div>
        </form>
    </div>
</template>