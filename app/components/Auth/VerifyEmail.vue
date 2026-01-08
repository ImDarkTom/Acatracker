<script setup lang="ts">

const props = defineProps<{
    email: string,
}>();

const { $csrfFetch } = useNuxtApp();

const errorText = ref('');

const isLoading = ref(false);
const resendCooldown = ref(0);
const canResendEmail = ref(true);

async function resendEmail() {
    if (!props.email) return;

    errorText.value = '';
    isLoading.value = true;

    try {
        await $csrfFetch('/api/auth/resend-verification', {
            method: 'POST',
            body: {
                email: props.email,
            }
        });
    } catch (error: unknown) {
        errorText.value = (error as { statusMessage: string }).statusMessage ? (error as { statusMessage: string }).statusMessage : 'An unknown error occurred.';
        return;
    } finally {
        isLoading.value = false;
    }

    canResendEmail.value = false;
    resendCooldown.value = 30;

    const interval = setInterval(() => {
        resendCooldown.value--;
        if (resendCooldown.value <= 0) {
            clearInterval(interval);
            canResendEmail.value = true;
        }
    }, 1000);
}
</script>

<template>
    <div class="w-full flex flex-col items-center justify-center gap-2 mb-10">
        <div class="card w-full md:w-md p-4 flex flex-col gap-2 items-center">
            <h1 class="text-xl font-bold text-center">Email Verification</h1>

            <div v-if="errorText" class="bg-errorbg p-2 rounded-sm">
                {{ errorText }}
            </div>

            <p>Check your inbox for a verification link.</p>

            <ButtonPrimary 
                class="w-fit mt-4" 
                :disabled="!canResendEmail || isLoading"
                @click="resendEmail">
                <LoadingIcon v-if="isLoading" />
                <span v-if="resendCooldown === 0">Resend email</span>
                <span v-else>Resend email ({{ resendCooldown }}s)</span>
            </ButtonPrimary>
        </div>
    </div>
</template>