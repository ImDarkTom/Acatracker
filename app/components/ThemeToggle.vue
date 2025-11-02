<script setup lang="ts">
const colorMode = useColorMode();

const isDark = computed({
    get() {
        return colorMode.value === 'dark';
    },
    set(value) {
        colorMode.preference = value ? 'dark' : 'light';
    }
});
</script>

<template>
    <label class="mr-2">
        <input v-model="isDark" type="checkbox" class="hidden">

        <Icon :name="isDark ? 'bi:sun' : 'bi:moon'" />
    </label>
</template>