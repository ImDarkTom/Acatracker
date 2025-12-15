<script setup lang="ts">
const authStore = useAuthStore();
</script>

<template>
    <DropdownMenuRoot v-if="!authStore.isLoading && authStore.user">
        <DropdownMenuTrigger as-child>
            <ButtonPrimary aria-label="My Account" class="data-[state=open]:bg-brand-500">
                <img 
                v-if="authStore.user.image" 
                :src="authStore.user.image" 
                :alt="authStore.user.name" 
                class="rounded-full size-8">
                <span>{{ authStore.user.name }}</span>
            </ButtonPrimary>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
            <Transition name="dropdown">
                <DropdownMenuContent 
                    :align="'start'"
                    :align-offset="16"
                    class="w-52 card bg-elevated rounded-md p-1 shadow-sm shadow-black overflow-hidden mt-1 z-100">
                    <CustomDropdownItem 
                        value="Dashboard" 
                        icon="material-symbols:dashboard-outline-rounded" 
                        :select-action="() => navigateTo('/dashboard')" />
                    <DropdownMenuSeparator class="h-px w-full bg-text-secondary my-1" />
                    <RouterLink to="/dashboard/subscribe">
                        <CustomDropdownItem 
                            value="Subscribe" 
                            icon="material-symbols:calendar-add-on-outline-rounded" />
                    </RouterLink>
                    <DropdownMenuSeparator class="h-px w-full bg-text-secondary my-1" />
                    <CustomDropdownItem 
                        value="Sign Out"
                        icon="material-symbols:logout-rounded" 
                        :select-action="() => navigateTo('/sign-out')" />
                </DropdownMenuContent>
            </Transition>
        </DropdownMenuPortal>
    </DropdownMenuRoot>
    <ButtonPrimary 
        v-else 
        :disabled="authStore.isLoading" 
        @click="authStore.signIn">
        <LoadingIcon v-if="authStore.isLoading" />
        <Icon v-else name="mdi:github" />
        
        <span>Sign in with Github</span>
    </ButtonPrimary>
</template>