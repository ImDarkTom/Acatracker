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
                :disabled="isLoading"
                :error="errors.name" />
            <AppFormField 
                name="description" 
                label="Description" 
                type="textarea" 
                placeholder="(Optional)" 
                :disabled="isLoading"
                :error="errors.description" />
            <AppFormField 
                name="module" 
                label="Module" 
                :disabled="isLoading"
                :errors="errors.module" />
            <AppFormField 
                name="dueAt" 
                label="Due" 
                type="date"
                :disabled="isLoading"
                :error="errors.dueAt" />
            <div class="flex flex-row justify-between" :class="{ 'opacity-50': isLoading }">
                <button :disabled="isLoading" type="button" class="bg-brand-900 p-2 flex gap-2 not-disabled:cursor-pointer" @click="$router.back()">
                    <Icon name="bi:arrow-left" size="24"/>
                    Back
                </button>
                <button :disabled="isLoading" type="submit" class="bg-brand-800 p-2 flex gap-1 pr-3 not-disabled:cursor-pointer">
                    <Icon v-if="isLoading" name="mdi:loading" class="animate-spin" size="24" />
                    <Icon v-else name="bi:plus" size="24"/>
                    Add
                </button>
            </div>
        </form>
    </div>
</template>