<script setup lang="ts">
const authStore = useAuthStore();
</script>

<template>
    <DropdownMenuRoot v-if="!authStore.isLoading && authStore.user">
        <DropdownMenuTrigger as-child>
            <AppBtnPrimary aria-label="My Account" class="data-[state=open]:bg-brand-500">
                <img 
                v-if="authStore.user.image" 
                :src="authStore.user.image" 
                :alt="authStore.user.name" 
                class="rounded-full size-8">
                <span>{{ authStore.user.name }}</span>
            </AppBtnPrimary>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
            <DropdownMenuContent class="w-52 shadow-sm bg-elevated rounded-md overflow-hidden mt-1">
                <CustomDropdownItem 
                    value="Dashboard" 
                    icon="bi:grid-1x2" 
                    :select-action="() => $router.push('/dashboard')" />
                <CustomDropdownItem 
                    value="Add" 
                    icon="bi:plus" 
                    :select-action="() => $router.push('/dashboard/add')" />
                <DropdownMenuSeparator class="h-px w-full bg-brand-50" />
                <CustomDropdownItem 
                    value="Sign Out"
                    icon="bi:box-arrow-right" 
                    :select-action="() => $router.push('/sign-out')" />
            </DropdownMenuContent>
        </DropdownMenuPortal>
    </DropdownMenuRoot>
    <AppBtnPrimary 
        v-else 
        :disabled="authStore.isLoading" 
        @click="authStore.signIn">
        <Icon v-if="authStore.isLoading" name="mdi:loading" class="animate-spin" />
        <Icon v-else name="bi:github" />
        
        <span>Sign in with Github</span>
    </AppBtnPrimary>
</template>