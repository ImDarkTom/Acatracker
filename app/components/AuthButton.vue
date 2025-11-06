<script setup lang="ts">
const authStore = useAuthStore();
</script>

<template>
    <DropdownMenuRoot v-if="!authStore.isLoading && authStore.user">
        <DropdownMenuTrigger 
            class="flex flex-row gap-2 items-center cursor-pointer bg-brand-700 hover:bg-brand-600 p-2"
            aria-label="My Account">
            <img 
                v-if="authStore.user.image" 
                :src="authStore.user.image" 
                :alt="authStore.user.name" 
                class="rounded-full size-8">
            <span>{{ authStore.user.name }}</span>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
            <DropdownMenuContent class="w-52 shadow-sm shadow-brand-950 bg-brand-800">
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
    <button v-else :disabled="authStore.isLoading" @click="authStore.signIn" class="disabled:opacity-50 not-disabled:cursor-pointer">
        <Icon v-if="authStore.isLoading" name="mdi:loading" class="animate-spin" />
        <Icon v-else name="bi:github" />
        
        <span class="ml-2">Sign in with Github</span>
    </button>
</template>