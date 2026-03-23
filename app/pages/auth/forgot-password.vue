<script setup lang="ts">
definePageMeta({
    layout: 'auth',
});

useHead({
    title: 'Password Reset | Acatracker',
    meta: [
        {
            name: 'description',
            content: 'Forgot your password? Send a password reset email for your Acatracker account.'
        }
    ]
});

const auth = useAuth();

const email = ref('');

function onSubmit() {
    
}

</script>

<template>
    <h1 class="text-xl font-bold text-center mb-4">Find your account</h1>

    <form 
        class="flex flex-col gap-2" 
        @submit.prevent="onSubmit">
        <label>
            <span>
                Enter the email associated with your account
            </span>
            <div class="flex flex-row gap-2">
                <Field
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    class="w-full outline-none ring-1 focus:ring-2 ring-highlight focus:ring-brand-focus p-2 rounded-md"
                    v-model="email">
                </Field>
            </div>
            <span name="email" class="text-sm text-errortxt" />
        </label>
        <ButtonPrimary 
            class="justify-center mt-2"
            type="submit">
            Continue
        </ButtonPrimary>
    </form>

    <span class="text-center">
        <NuxtLink to="/auth/sign-in" class="link-text">Back to Sign In</NuxtLink>
    </span>
</template>