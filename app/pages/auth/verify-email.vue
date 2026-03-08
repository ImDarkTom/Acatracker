<script setup lang="ts">
useHead({
    title: 'Verify your email | Acatracker',
});

definePageMeta({
    layout: 'auth',
});

const auth = useAuth();
const { $csrfFetch } = useNuxtApp();

const errorText = ref('');

const isLoading = ref(false);

const resendTimeout = ref(0);
const canResendEmail = ref(false);

const cooldownInterval = ref<NodeJS.Timeout | null>(null);

function startCooldown(seconds: number) {
    if (cooldownInterval.value) {
        clearInterval(cooldownInterval.value);
    }

    canResendEmail.value = false;
    resendTimeout.value = seconds;

    cooldownInterval.value = setInterval(() => {
        resendTimeout.value--;

        if (resendTimeout.value <= 0) {
            clearInterval(cooldownInterval.value!);
            cooldownInterval.value = null;
            canResendEmail.value = true;
        }
    }, 1000);
}

async function resendEmail() {
    errorText.value = '';
    isLoading.value = true;

    try {
        await $csrfFetch('/api/auth/resend-verification', { method: 'POST' });
    } catch (error: unknown) {
        isLoading.value = false;
        const err = error as { data?: { statusMessage?: string; data?: { timeoutLeft?: number } } };

        if (err.data?.statusMessage && err.data.data?.timeoutLeft) {
            startCooldown(err.data.data.timeoutLeft);
        } else {
            errorText.value = 'An unknown error occurred.';
        }
        return;
    }

    isLoading.value = false;
    startCooldown(30);
}

watch(() => auth.user, (user) => {
    if (user.value && !user.value.emailVerified) {
        resendEmail()
    }
}, { immediate: true, once: true });

onUnmounted(() => {
    if (cooldownInterval.value) {
        clearInterval(cooldownInterval.value);
    }
});
</script>

<template>
    <div v-if="auth.isLoading.value">
        <LoadingIcon /> Loading...
    </div>
    <div 
        v-else-if="!auth.user.value"
        class="flex flex-col gap-2 items-center">
        <AppErrorBanner text="Couldn't get sign-in info." />
        <NuxtLink to="/">
            <ButtonPrimary>
                <Icon name="lucide:arrow-left" />
                Back to home
            </ButtonPrimary>
        </NuxtLink>
    </div>
    <div 
        v-else-if="auth.user.value.emailVerified" 
        class="flex flex-col gap-2 items-center">
        <span>Your email is already verified!</span>
        <AppBackBtn />
    </div>
    <div v-else class="flex flex-col gap-2 items-center">
        <h1 class="text-xl font-bold text-center">Email Verification</h1>

        <AppErrorBanner :text="errorText" />

        <p>Check your inbox for a verification link.</p>

        <ButtonPrimary 
            class="w-fit mt-4" 
            :disabled="!canResendEmail || isLoading"
            @click="resendEmail">
            <LoadingIcon v-if="isLoading" />
            <span>
                Resend email
                <template v-if="resendTimeout !== 0">
                    ({{ resendTimeout }}s)
                </template>
            </span>
        </ButtonPrimary>
    </div>
</template>