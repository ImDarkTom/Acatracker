<script setup lang="ts">
const { data, status } = await useFetch('/api/assesments', {
    lazy: true,
});

const modulesStore = useModuleStore();
const { modules } = storeToRefs(modulesStore);

onMounted(() => {
    modulesStore.refresh();
});
</script>

<template>
    <div class="w-full flex flex-row gap-4">
        <div class="flex flex-col gap-2 w-2/5">
            <div class="bg-base flex flex-col grow rounded-md">
                <div v-if="status === 'pending'" class="flex items-center justify-center h-full">
                    <Icon name="mdi:loading" class="animate-spin" size="32" />
                </div>
                <div v-else-if="data && data.length > 0" class="flex flex-col p-2 grow">
                    <div class="flex flex-col gap-2 grow">
                        <div
                            v-for="module in modules"
                            :key="module.id">
                            <span class="text-lg">{{ module.name }}</span>
                            <div 
                                v-for="assesment in data" 
                                :key="assesment.id" 
                                class="bg-elevated p-2 rounded-sm" >
                                <span class="text-lg">{{ assesment.name }}</span>
                                <p class="text-brand-100">{{ assesment.description ?? '(No description.)' }}</p>
                            </div>
                        </div>
                    </div>
                    <AddModule />
                </div>
                <div v-else class="h-full flex flex-col gap-2 items-center justify-center">
                    <p>Add an assesment to get started</p>
                    <NuxtLink to="/dashboard/add">
                        <AppBtnPrimary>
                            <Icon name="bi:plus" />
                            Add Assesment
                        </AppBtnPrimary>
                    </NuxtLink>
                </div>
            </div>
        </div>
        <div class="w-3/5 bg-base rounded-md"></div>
    </div>
</template>