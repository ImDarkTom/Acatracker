<script setup lang="ts">
import z from 'zod';

definePageMeta({
    layout: 'auth',
});

useHead({
    title: 'Sign Up | Acatracker',
    meta: [
        {
            name: 'description',
            content: 'Create your Acatracker account.'
        }
    ],
});

const auth = useAuth();

const { handleSubmit, errors, meta, setErrors } = useForm({
    validationSchema: toTypedSchema(z.object({
        email: z.email('Invalid email address.'),
        password: z.string("A password is required.").min(8, "Password must be at least 8 characters.").max(128, "Password must be under 128 characters."),
        name: z.string('A username is required.').max(30, 'Username must be under 30 characters.')
    })),
    initialValues: {}
});

const { isLoading: isFormLoading, submitHandler } = useEditDialogForm({ meta, handleSubmit }, { confirmBeforeExiting: false });
const errorText = ref<string>('');

const isSigningUp = computed(() => {
    return isFormLoading.value || auth.isLoading.value;
});

const onSubmit = submitHandler(async (values: { email: string, password: string, name: string }) => {
    errorText.value = '';

    const { error } = await auth.signUpWithEmail(
        values.email,
        values.password,
        values.name
    );

    if (error) {
        errorText.value = error.message ?? 'An unknown error occurred.';
    } else {
        navigateTo('/auth/verify-email');
    }
}, setErrors);
</script>

<template>
    <h1 class="text-xl font-bold text-center mb-4">Create an Acatracker account</h1>
    <div v-if="errorText" class="bg-errorbg p-2 rounded-sm">
        {{ errorText }}
    </div>

    <AuthExternalAuthButtons />

    <div class="flex flex-row gap-2 items-center">
        <div class="w-full h-px bg-text-muted"></div>
        <span class="text-sm">or</span>
        <div class="w-full h-px bg-text-muted"></div>
    </div>

    <form class="flex flex-col gap-2" @submit.prevent="onSubmit">
        <label>
            <span class="font-medium">
                Email
            </span>
            <div class="flex flex-row gap-2">
                <Field
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    required
                    :disabled="isSigningUp"
                    :error="errors.email"
                    class="w-full outline-none ring-1 focus:ring-2 ring-highlight focus:ring-brand-focus p-2 rounded-md"
                    :class="{
                        'ring-errortxt!': errors.email,
                        'opacity-50': isSigningUp,
                    }">
                </Field>
            </div>
            <ErrorMessage name="email" class="text-sm text-errortxt" />
        </label>
        <label>
            <span class="font-medium">
                Username
            </span>
            <div class="flex flex-row gap-2">
                <Field
                    name="name"
                    type="text"
                    placeholder="Enter a username"
                    required
                    :disabled="isSigningUp"
                    :error="errors.name"
                    class="w-full outline-none ring-1 focus:ring-2 ring-highlight focus:ring-brand-focus p-2 rounded-md"
                    :class="{
                        'ring-errortxt!': errors.name,
                        'opacity-50': isSigningUp,
                    }">
                </Field>
            </div>
            <ErrorMessage name="name" class="text-sm text-errortxt" />
        </label>
        <label>
            <span class="font-medium">
                Password
            </span>
            <div class="flex flex-row gap-2">
                <Field
                    name="password"
                    type="password"
                    placeholder="Enter a password"
                    :disabled="isSigningUp"
                    :error="errors.password"
                    class="w-full outline-none ring-1 focus:ring-2 ring-highlight focus:ring-brand-focus p-2 rounded-md"
                    :class="{
                        'ring-errortxt!': errors.password,
                        'opacity-50': isSigningUp,
                    }">
                </Field>
            </div>
            <ErrorMessage name="password" class="text-sm text-errortxt" />
        </label>
        <ButtonPrimary
            class="justify-center"
            type="submit" 
            :disabled="isSigningUp">
            <Icon v-if="!isSigningUp" name="lucide:user-plus" />
            <LoadingIcon v-else />
            Sign Up
        </ButtonPrimary>
    </form>

    <span class="text-center">
        Already have an account? <NuxtLink to="/auth/sign-in" class="link-text">Sign in</NuxtLink>
    </span>
</template>