<script setup lang="ts">
import z from 'zod';

useHead({
    title: 'Login | Acatracker',
    meta: [
        {
            name: 'description',
            content: 'Login to your Acatracker account.'
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

const { isLoading, submitHandler } = useEditDialogForm({ meta, handleSubmit }, { confirmBeforeExiting: false });
const errorText = ref<string>('');

const onSubmit = submitHandler(async (values: { email: string, password: string }) => {
    errorText.value = '';

    const { csrf } = useCsrf();

    const headers = new Headers();
    headers.append('csrf-token', csrf);

    const { data, error } = await authClient.signIn.email({
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

    navigateTo('/dashboard');
}, setErrors);
</script>

<template>
    <div class="w-full flex flex-col items-center justify-center gap-2 mb-10">
        <div class="card w-full md:w-md p-4">
            <h1 class="text-xl font-bold">Login</h1>
            <div v-if="errorText" class="bg-errorbg p-2 rounded-sm">
                {{ errorText }}
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
                            :disabled="isLoading"
                            :error="errors.email"
                            class="w-full outline-none ring-1 focus:ring-2 ring-highlight focus:ring-brand-focus p-2 rounded-md"
                            :class="{
                                'ring-errortxt!': errors.email,
                                'opacity-50': isLoading,
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
                            :disabled="isLoading"
                            :error="errors.password"
                            class="w-full outline-none ring-1 focus:ring-2 ring-highlight focus:ring-brand-focus p-2 rounded-md"
                            :class="{
                                'ring-errortxt!': errors.password,
                                'opacity-50': isLoading,
                            }">
                        </Field>
                    </div>
                    <ErrorMessage name="password" class="text-sm text-errortxt" />
                </label>
                <div class="flex justify-end mt-2">
                    <ButtonPrimary 
                        type="submit" 
                        :disabled="isLoading">
                        <Icon v-if="!isLoading" name="lucide:log-in" />
                        <LoadingIcon v-else />
                        Login
                    </ButtonPrimary>
                </div>
            </form>
        </div>
    </div>
</template>