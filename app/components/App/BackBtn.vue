<script setup lang="ts">
const uiStore = useUiStore();
</script>

<template>
    <NuxtLink :to="uiStore.lastOpenedView.path">
        <ButtonPrimary>
            <Icon name="lucide:arrow-left" />
            {{ uiStore.lastOpenedView.backText }}
        </ButtonPrimary>
    </NuxtLink>
</template>