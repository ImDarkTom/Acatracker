<script setup lang="ts">
const { data, status } = await useFetch('/api/assesments', {
    lazy: true,
});
</script>

<template>
    <div class="w-full flex flex-row gap-2">
        <div class="flex flex-col gap-2 w-2/5">
            <div class="bg-brand-800 flex flex-col grow">
                <div v-if="status === 'pending'" class="flex items-center justify-center h-full">
                    <Icon name="mdi:loading" class="animate-spin" size="32" />
                </div>
                <div v-else-if="data && data.length > 0" class="flex flex-col p-2">
                    <div 
                        v-for="assesment in data" 
                        :key="assesment.id" 
                        class="bg-brand-700 p-2" >
                        <span class="text-lg">{{ assesment.name }} - {{ assesment.module }}</span>
                        <p class="text-brand-100">{{ assesment.description ?? '(No description.)' }}</p>
                    </div>
                </div>
                <div v-else class="h-full flex flex-col gap-2 items-center justify-center">
                    <p>Add an assesment to get started</p>
                    <NuxtLink to="/dashboard/add">
                        <button class="flex flex-row gap-2 bg-brand-600 p-4 justify-center items-center cursor-pointer">
                            <Icon name="bi:plus" />
                            Add Assesment
                        </button>
                    </NuxtLink>
                </div>
            </div>
        </div>
        <div class="w-3/5 bg-brand-800"></div>
    </div>
</template>