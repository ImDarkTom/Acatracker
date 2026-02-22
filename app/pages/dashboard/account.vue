<script setup lang="ts">
definePageMeta({
    layout: 'dashboard',
});

useHead({
    title: 'Account | Acatracker',
});

const auth = useAuth();

async function promptDeleteAccount() {
    if (!confirm("Are you sure you want to delete your account? This action is irreversible.")) return;

    await auth.deleteAccount();

    navigateTo('/');
}

</script>

<template>
    <div class="flex flex-col gap-2">
        <RouterLink to="/dashboard" class="w-min">
            <ButtonPrimary >
                <Icon name="lucide:arrow-left" />
                Dashboard
            </ButtonPrimary>
        </RouterLink>
        <h1 class="text-2xl font-bold">Account Info</h1>
        <div class="flex flex-col gap-4">
            <h2 class="text-xl font-semibold">Details</h2>
            <template v-if="!auth.user.value">
                <div v-if="auth.isLoading.value">
                    <LoadingIcon />
                </div>
                <div v-else>
                    Failed to load user
                </div>
            </template>
            <div v-else class="flex flex-row gap-4">
                <img 
                    v-if="auth.user.value.image"
                    :src="auth.user.value.image"  
                    :alt="auth.user.value.name" 
                    class="rounded-full size-32 cursor-pointer ring-brand-focus">
                <div v-else class="rounded-full size-32 text-6xl bg-brand-muted flex items-center justify-center font-black cursor-pointer">
                    {{ auth.user.value.name[0] ?? '?' }}
                </div>
                <div class="flex flex-col gap-2">
                    <div>
                        <span class="text-xl font-medium">{{ auth.user.value.name }}</span>
                    </div>
                    <div class="flex flex-row gap-2 items-center">
                        <span>{{ auth.user.value.email }}</span>
                        <AppTooltip v-if="auth.user.value.emailVerified" content="Verified Email">
                            <Icon name="lucide:check" class="text-event-released" />
                        </AppTooltip>
                        <AppTooltip v-else content="Email not verified">
                            <Icon name="lucide:x" class="text-errortxt" />
                        </AppTooltip>
                    </div>
                    <div>
                        <span>Member since {{ new Date(auth.user.value.createdAt).toLocaleDateString() }}</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex flex-col gap-4">
            <h2 class="text-xl font-semibold">Actions</h2>
            <ButtonSecondary class="w-fit">
                <Icon name="lucide:user-pen" />
                Change username
            </ButtonSecondary>
            <ButtonDanger class="w-fit" @click="promptDeleteAccount">
                <Icon name="lucide:user-minus" />
                Delete account
            </ButtonDanger>
        </div>
    </div>
</template>