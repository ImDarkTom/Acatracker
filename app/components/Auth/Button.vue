<script setup lang="ts">
const auth = useAuth();
</script>

<template>
    <DropdownMenuRoot v-if="!auth.isLoading.value && auth.user.value">
        <DropdownMenuTrigger class="data-[state=open]:*:ring-1">
            <AppTooltip :content="auth.user.value.name">
                <img 
                    v-if="auth.user.value.image"
                    :src="auth.user.value.image"  
                    :alt="auth.user.value.name" 
                    class="rounded-full size-8 cursor-pointer ring-brand-focus">
                <div v-else class="rounded-full size-8 bg-brand-muted flex items-center justify-center font-black cursor-pointer">
                    {{ auth.user.value.name[0] ?? '?' }}
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
                    value="My Account"
                    icon="lucide:circle-user" 
                    link="/dashboard/account" />
                <CustomDropdownItem 
                    value="Sign Out"
                    icon="lucide:log-out" 
                    link="/auth/sign-out" />
            </DropdownMenuContent>
        </DropdownMenuPortal>
    </DropdownMenuRoot>
    <AuthSignUpSignInButtons v-else />
</template>