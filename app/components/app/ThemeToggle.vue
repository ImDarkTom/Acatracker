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
    <ClientOnly>
        <label class="flex items-center cursor-pointer">
            <input v-model="isDark" type="checkbox" class="hidden">
            
            <Icon :name="isDark ? 'material-symbols:light-mode-outline-rounded' : 'material-symbols:dark-mode-outline-rounded'" size="20" />
        </label>
    </ClientOnly>
</template>