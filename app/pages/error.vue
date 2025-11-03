<script setup lang="ts">
const route = useRoute();

const error = route.query.error || "An unknown error occured.";
</script>

<template>
    <div>
        <div class="bg-error p-2 mb-2">
            Oh no! {{ error }}
        </div>
        <NuxtLink to="/">
            <button class="bg-brand-700 p-2 flex gap-2 items-center cursor-pointer">
                <Icon name="bi:arrow-left" />
                Home
            </button>
        </NuxtLink>
    </div>
</template>