<script setup lang="ts">
const route = useRoute();

useHead({
    title: 'An error occurred | Acatracker'
});

const error = route.query.error || "An unknown error occurred.";
</script>

<template>
    <div>
        <div class="bg-errorbg p-2 mb-2 rounded-md">
            Oh no! {{ error }}
        </div>
        <NuxtLink to="/">
            <ButtonPrimary>
                <Icon name="lucide:arrow-left" />
                Home
            </ButtonPrimary>
        </NuxtLink>
    </div>
</template>