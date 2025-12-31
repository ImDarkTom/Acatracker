<script setup lang="ts">
import z from 'zod';

useHead({
    title: 'Sign Up | Acatracker',
    meta: [
        {
            name: 'description',
            content: 'Create your Acatracker account.'
        }
    ]
});

const { handleSubmit, errors, meta, setErrors } = useForm({
    validationSchema: toTypedSchema(z.object({
        email: z.email('Invalid email address.'),
        password: z.string("A password is required.").min(8, "Password must be at least 8 characters.").max(128, "Password must be under 128 characters.")
    })),
    initialValues: {}
});

const { isOpen, isLoading, submitHandler, confirmBeforeExiting, submitError } = useEditDialogForm({ meta, handleSubmit });

const onSubmit = submitHandler((values) => {
    console.log(values);
}, setErrors);

const authStore = useAuthStore();
</script>

<template>
    <div class="w-full flex flex-col items-center justify-center gap-2 mb-10">
        <div class="card">
            <h1>Sign Up</h1>
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
                        <Icon v-if="!isLoading" name="lucide:plus" />
                        <LoadingIcon v-else />
                        Sign Up
                    </ButtonPrimary>
                </div>
            </form>
        </div>
    </div>
</template>