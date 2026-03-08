<script setup lang="ts" generic="T extends EventTypeKey">
import type { RouteLocationRaw } from 'vue-router';

interface Breadcrumb {
    label: string,
    to?: RouteLocationRaw
}

const props = defineProps<{
    moduleCode: string,
    breadcrumbs: Breadcrumb[],
    title: string,
    titleTo: RouteLocationRaw,
    date: string,
    isCompleted: boolean,
}>();

const emit = defineEmits<{
    'update:isCompleted': [value: boolean]
}>()
</script>

<template>
    <div class="card flex flex-row justify-between p-3">
        <div class="flex flex-col">
            <span class="text-sm flex flex-row gap-2">
                <code class="ring-1 ring-inset text-xs p-1 rounded-sm h-min">
                    {{ moduleCode }}
                </code>
                <span class="inline-flex gap-1">
                    <template 
                        v-for="(crumb, i) in breadcrumbs" 
                        :key="crumb.label">
                        <span v-if="i > 0">></span>
                        <NuxtLink
                            v-if="crumb.to"
                            class="hover:underline hover:text-text-primary"
                            :to="crumb.to">
                            {{ crumb.label }}
                        </NuxtLink>
                        <span v-else>{{ crumb.label }}</span>
                    </template>
                </span>
            </span>

            <NuxtLink
                class="font-medium text-lg hover:underline hover:text-text-primary"
                :to="titleTo">
                {{ title }}
            </NuxtLink>
        </div>
        
        <div class="flex flex-col gap-2 justify-between items-end">
            <span class="text-sm text-text-muted">{{ date }}</span>
            <AppCheckbox
                :checked="isCompleted"
                @click="$emit('update:isCompleted', !isCompleted)" />
        </div>
    </div>
</template>