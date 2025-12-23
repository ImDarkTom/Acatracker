<script setup lang="ts">
defineProps<{
    to: string;
    iconName: string;
    text: string;
}>();
</script>

<template>
    <li>
        <RouterLink :to class="flex flex-row gap-1" active-class="text-brand-base">
            <Icon :name="iconName" size="24" />
            <span class="hidden md:block">{{ text }}</span>
        </RouterLink>
    </li>
</template>