<script setup lang="ts">
const authStore = useAuthStore();

</script>

<template>
    <div class="pt-16 flex items-center justify-center">
        <div class="text-center">
            <div class="max-w-md">
                <h1 class="text-5xl font-bold text-brand-100">Acatracker</h1>
                <p class="py-6">Open-source academic tracker.</p>
                
                <button v-if="authStore.user" class="p-4 bg-brand-600" >
                    <NuxtLink :to="{ name: 'dashboard' }">
                        Open Dashboard
                    </NuxtLink>
                </button>
                <AuthButton v-else class="p-4 bg-brand-600" />
            </div>
        </div>
    </div>
</template>