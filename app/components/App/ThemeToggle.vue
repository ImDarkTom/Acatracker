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
    <label class="flex items-center cursor-pointer">
        <input 
            v-model="isDark"
            type="checkbox"
            class="hidden">
        
        <Icon
            v-if="$colorMode.preference === 'dark'" 
            name="lucide:sun"
            size="20" />
        <Icon 
            v-else
            name="lucide:moon"
            size="20" />
    </label>
</template>