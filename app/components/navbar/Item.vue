<script setup lang="ts">
defineProps<{
    to: string;
    iconName: string;
}>();
</script>

<template>
    <li>
        <RouterLink :to class="flex flex-row gap-2" active-class="text-brand-500">
            <Icon :name="iconName" />
        </RouterLink>
    </li>
</template>