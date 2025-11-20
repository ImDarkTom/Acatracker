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
                <div v-else class="flex flex-col p-2 grow">
                    <div v-if="assesments && assesments.length > 0" class="flex flex-col gap-2 grow">
                        <DashboardAssesmentListItem
                            v-for="module in modules"
                            :key="module.id"
                            :module
                            :assesments />
                    </div>
                    <div v-else class="flex grow items-center justify-center">
                        Add an assessment to get started
                    </div>
                    <div class="flex flex-row gap-2">
                        <PopupAddAssesment>
                            <AppBtnPrimary class="p-4 w-full px-auto">
                                <Icon name="material-symbols:add-notes-outline-rounded" />
                                Add Assesment
                            </AppBtnPrimary>
                        </PopupAddAssesment>
                        <PopupAddModule>
                            <AppBtnPrimary aria-label="Add Module" title="Add Module" class="p-4 px-auto">
                                <Icon name="material-symbols:create-new-folder-outline-rounded" />
                            </AppBtnPrimary>
                        </PopupAddModule>
                    </div>
                </div>
            </div>
        </div>
        <div class="w-full md:w-3/5 bg-base rounded-md flex flex-col gap-2 p-2">
            <NuxtPage />
        </div>
    </div>
</template>