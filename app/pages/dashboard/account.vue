<script setup lang="ts">
useHead({
    title: 'Account | Acatracker',
});

const authStore = useAuthStore();
const user = authStore.user;

</script>

<template>
    <div class="w-full flex flex-col md:flex-row gap-4 md:max-h-[calc(100vh-6rem)]">
        <div class="w-full card flex flex-col gap-4">
            <template v-if="!user">
                <div v-if="authStore.isLoading">
                    <LoadingIcon />
                </div>
                <div v-else>
                    Failed to load user
                </div>
            </template>
            <template v-else>
                <RouterLink to="/dashboard" class="w-min">
                    <ButtonPrimary >
                        <Icon name="lucide:arrow-left" />
                        Dashboard
                    </ButtonPrimary>
                </RouterLink>
                <div class="flex flex-row gap-4">
                    <img 
                        v-if="user.image"
                        :src="user.image"  
                        :alt="user.name" 
                        class="rounded-full size-32 cursor-pointer ring-brand-focus">
                    <div v-else class="rounded-full size-32 bg-brand-muted flex items-center justify-center font-black cursor-pointer">
                        {{ user.name[0] ?? '?' }}
                    </div>
                    <div class="flex flex-col gap-2">
                        <div>
                            <span class="text-xl font-medium">{{ user.name }}</span>
                        </div>
                        <div class="flex flex-row gap-2 items-center">
                            <span>{{ user.email }}</span>
                            <AppTooltip v-if="user.emailVerified" content="Verified Email">
                                <Icon name="lucide:check" class="text-event-released" />
                            </AppTooltip>
                            <AppTooltip v-else content="Email not verified">
                                <Icon name="lucide:x" class="text-errortxt" />
                            </AppTooltip>
                        </div>
                        <div>
                            <span>Member since {{ new Date(user.createdAt).toLocaleDateString() }}</span>
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>