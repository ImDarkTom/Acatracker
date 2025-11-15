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
            <DropdownMenuContent 
                :align="'start'"
                :align-offset="16"
                class="w-52 shadow-sm bg-elevated rounded-md overflow-hidden mx-2">
                <CustomDropdownItem 
                    value="Dashboard" 
                    icon="material-symbols:dashboard-outline-rounded" 
                    :select-action="() => $router.push('/dashboard')" />
                <CustomDropdownItem 
                    value="Add Assesment" 
                    icon="material-symbols:add-notes-outline-rounded" 
                    :select-action="() => $router.push('/dashboard/add')" />
                <DropdownMenuSeparator class="h-px w-full bg-brand-50" />
                <CustomDropdownItem 
                    value="Sign Out"
                    icon="material-symbols:logout-rounded" 
                    :select-action="() => $router.push('/sign-out')" />
                <DropdownMenuArrow class="fill-elevated" />
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