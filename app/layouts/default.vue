<script setup lang="ts">
import NavBar from '~/components/NavBar.vue';

</script>

<template>
    <div class="h-dvh bg-gray-950 text-gray-50">
        <NavBar />
        <main class="p-4">
            <slot />
        </main>
    </div>
</template>