<script setup lang="ts">
const authStore = useAuthStore();
</script>

<template>
    <DropdownMenuRoot v-if="!authStore.isLoading && authStore.user">
        <DropdownMenuTrigger class="data-[state=open]:*:ring-1">
            <AppTooltip :content="authStore.user.name">
                <img 
                    v-if="authStore.user.image"
                    :src="authStore.user.image"  
                    :alt="authStore.user.name" 
                    class="rounded-full size-8 cursor-pointer ring-brand-focus">
                <div v-else class="rounded-full size-8 bg-brand-muted flex items-center justify-center font-black cursor-pointer">
                    {{ authStore.user.name[0] ?? '?' }}
                </div>
            </AppTooltip>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
            <DropdownMenuContent 
                :align="'start'"
                :align-offset="16"
                class="dropdown-content z-100">
                <CustomDropdownItem 
                    value="Dashboard" 
                    icon="lucide:layout-dashboard" 
                    link="/dashboard" />
                <CustomDropdownSeparator />
                <CustomDropdownItem 
                    value="Subscribe" 
                    icon="lucide:calendar-plus"
                    link="/dashboard/subscribe" />
                <CustomDropdownSeparator />
                <CustomDropdownItem 
                    value="Sign Out"
                    icon="lucide:log-out" 
                    link="/sign-out" />
            </DropdownMenuContent>
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