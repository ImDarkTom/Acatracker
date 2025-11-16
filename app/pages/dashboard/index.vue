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
                    <LoadingIcon size="32" />
                </div>
                <div v-else-if="assesments && assesments.length > 0" class="flex flex-col p-2 grow">
                    <div class="flex flex-col gap-2 grow">
                        <DashboardAssesmentListItem
                            v-for="module in modules"
                            :key="module.id"
                            :module
                            :assesments />
                    </div>
                    <AddModuleBtn />
                </div>
                <div v-else class="h-full flex flex-col gap-2 items-center justify-center">
                    <p>Add an assesment to get started</p>
                    <NuxtLink to="/dashboard/add">
                        <AppBtnPrimary>
                            <Icon name="material-symbols:add" />
                            Add Assesment
                        </AppBtnPrimary>
                    </NuxtLink>
                </div>
            </div>
        </div>
        <div class="w-full md:w-3/5 bg-base rounded-md flex flex-col gap-2 p-2">
            <div v-if="status === 'pending'" class="flex items-center justify-center grow">
                <LoadingIcon size="32" />
            </div>
            <DashboardCalendar v-else-if="assesments && assesments.length > 0" :assesments />
            <div v-else class="m-1 bg-linear-to-br from-elevated to-elevated/80 min-h-[calc(100vh/2)] rounded-sm flex items-center justify-center select-none">
                Items will appear on the calendar once you add an assesment.
            </div>
        </div>
    </div>
</template>