<script setup lang="ts">
const authStore = useAuthStore();

const { data: sessionData } = await useFetch('/api/auth/get-session', { key: 'auth-session' });
authStore.setSession(sessionData.value as any);
</script>

<template>
    <div class="min-h-screen flex flex-col">
        <NavBar />
        <main class="p-4 grow">
            <slot />
        </main>
    </div>
</template>