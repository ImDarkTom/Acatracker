<script setup lang="ts">
const assesmentsStore = useAssesmentsStore();
const { status, assesments } = storeToRefs(assesmentsStore);

const modulesStore = useModuleStore();
const { modules } = storeToRefs(modulesStore);

onMounted(() => {
    modulesStore.refresh();
    assesmentsStore.refresh();
});

</script>

<template>
    <div class="w-full flex flex-col md:flex-row gap-4">
        <div class="flex flex-col gap-2 w-full md:w-2/5">
            <div class="bg-base flex flex-col grow rounded-md">
                <div v-if="status === 'pending'" class="flex items-center justify-center h-full">
                    <Icon name="mdi:loading" class="animate-spin" size="32" />
                </div>
                <div v-else-if="assesments && assesments.length > 0" class="flex flex-col p-2 grow">
                    <div class="flex flex-col gap-2 grow">
                        <div
                            v-for="module in modules"
                            :key="module.id">
                            <span class="text-lg">{{ module.name }}</span>
                            <div 
                                v-for="assesment in assesments.filter(a => a.module === module.id)" 
                                :key="assesment.id" 
                                class="bg-elevated p-2 rounded-sm" >
                                <span class="text-lg">{{ assesment.name }}</span>
                                <div class="flex flex-row w-full gap-1 text-sm">
                                    <span v-if="assesment.releasedAt" class="text-brand-200 flex flex-row gap-1 items-center">
                                        <Icon name="carbon:rocket" size="12" />
                                        {{ new Date(assesment.releasedAt).toLocaleDateString() }}
                                    </span>

                                    <div class="w-full h-px my-auto border-b-2 border-dotted border-brand-200"></div>

                                    <span class="text-brand-200 flex flex-row gap-1 items-center">
                                        <Icon name="carbon:event-schedule" size="12" />
                                        {{ new Date(assesment.dueAt).toLocaleDateString() }}
                                    </span>
                                </div>
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
        <div class="w-full md:w-3/5 bg-base rounded-md flex flex-col gap-2 p-2">
            <div v-if="status === 'pending'">
                <Icon name="mdi:loading" class="animate-spin" size="32" />
            </div>
            <DashboardCalendar v-else-if="assesments && assesments.length > 0" :assesments />
        </div>
    </div>
</template>