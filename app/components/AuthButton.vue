<script setup lang="ts">
const authStore = useAuthStore();
</script>

<template>
    <div v-if="!authStore.isLoading && authStore.user" class="group relative overflow-visible">
        <div tabindex="0" role="button" class="flex flex-row gap-2 items-center cursor-pointer">
            <img v-if="authStore.user.image" :src="authStore.user.image" :alt="authStore.user.name" class="rounded-full size-8">
            <span>{{ authStore.user.name }}</span>
        </div>
        <ul tabindex="0" class="absolute not-group-focus-within:hidden top-full right-0 z-1 w-52 p-1 shadow-sm bg-brand-800">
            <li class="w-full">
                <NuxtLink :to="{ name: 'sign-out' }" class="flex p-2 hover:bg-brand-700">
                    <Icon name="bi:box-arrow-right" size="24" class="mr-2" />
                    Sign Out
                </NuxtLink>
            </li>
        </ul>
    </div>
    <button v-else :disabled="authStore.isLoading" @click="authStore.signIn" class="disabled:opacity-50 not-disabled:cursor-pointer">
        <Icon v-if="authStore.isLoading" name="mdi:loading" class="animate-spin" />
        <Icon v-else name="bi:github" />
        
        <span class="ml-2">Sign in with Github</span>
    </button>
</template>