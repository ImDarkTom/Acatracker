<script setup lang="ts">
import z from 'zod';

definePageMeta({
    layout: 'auth',
});

useHead({
    title: 'Sign In | Acatracker',
    meta: [
        {
            name: 'description',
            content: 'Sign in to your Acatracker account.'
        }
    ]
});

const { handleSubmit, errors, meta, setErrors } = useForm({
    validationSchema: toTypedSchema(z.object({
        email: z.email('Invalid email address.'),
        password: z.string("A password is required."),
    })),
    initialValues: {}
});

const { $authClient } = useNuxtApp();
const auth = useAuth();

const { isLoading: isFormLoading, submitHandler } = useEditDialogForm({ meta, handleSubmit }, { confirmBeforeExiting: false });
const errorText = ref<string>('');

const isSigningIn = computed(() => {
    return isFormLoading.value || auth.isLoading.value;
});

const onSubmit = submitHandler(async (values: { email: string, password: string }) => {
    errorText.value = '';

    const { csrf } = useCsrf();

    const headers = new Headers();
    headers.append('csrf-token', csrf);

    const { data, error } = await $authClient.signIn.email({
        email: values.email,
        password: values.password,
        callbackURL: '/dashboard',
        fetchOptions: {
            headers,
        }
    });

    if (error) {
        errorText.value = error.message ?? 'An unknown error occurred.';
        return;
    }

    if (!data.user.emailVerified) {
        navigateTo('/verify-email');
        return;
    }

    navigateTo('/dashboard');
}, setErrors);

</script>

<template>
    <h1 class="text-xl font-bold text-center mb-4">Sign in to Acatracker</h1>
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
                    :disabled="isSigningIn"
                    :error="errors.email"
                    class="w-full outline-none ring-1 focus:ring-2 ring-highlight focus:ring-brand-focus p-2 rounded-md"
                    :class="{
                        'ring-errortxt!': errors.email,
                        'opacity-50': isSigningIn,
                    }">
                </Field>
            </div>
            <ErrorMessage name="email" class="text-sm text-errortxt" />
        </label>
        <label>
            <span class="font-medium">
                Password
            </span>
            <div class="flex flex-row gap-2">
                <Field
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    :disabled="isSigningIn"
                    :error="errors.password"
                    class="w-full outline-none ring-1 focus:ring-2 ring-highlight focus:ring-brand-focus p-2 rounded-md"
                    :class="{
                        'ring-errortxt!': errors.password,
                        'opacity-50': isSigningIn,
                    }">
                </Field>
            </div>
            <ErrorMessage name="password" class="text-sm text-errortxt" />
        </label>
        <ButtonPrimary 
            class="justify-center mt-2"
            type="submit"
            :disabled="isSigningIn">
            <Icon v-if="!isSigningIn" name="lucide:log-in" />
            <LoadingIcon v-else />
            Sign in
        </ButtonPrimary>
    </form>

    <span class="text-center">
        New? <RouterLink to="/sign-up" class="link-text">Create an account</RouterLink>
    </span>
</template>