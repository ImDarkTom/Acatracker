<script setup lang="ts">
defineProps<{
    label: string;
    icon: string;
    to: string;
}>();

const uiStore = useUiStore();
</script>

<template>
    <NuxtLink 
        class="group/link" 
        :to 
        :exact-active-class="`active`"
        :class="{
            'active': uiStore.lastOpenedView.path === to,
        }">
        <div class="group-[.active]/link:text-text-primary text-text-muted hover:text-text-secondary flex flex-col items-center gap-1 cursor-pointer group">
            <div class="group-hover:bg-bg-base group-[.active]/link:bg-bg-base-active rounded-md size-8 flex items-center justify-center">
                <Icon :name="icon" size="22" />
            </div>
            <span class="text-xs font-medium">{{ label }}</span>
        </div>
    </NuxtLink>
</template>