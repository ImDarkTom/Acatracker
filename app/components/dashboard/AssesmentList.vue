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
    <div class="h-full">
        <div v-if="status === 'pending'" class="flex items-center justify-center h-full">
            <LoadingIcon size="32" />
        </div>
        <div v-else class="flex flex-col max-h-full">
            <div v-if="assesments && assesments.length > 0" class="p-2 flex grow flex-col gap-2 overflow-y-auto">
                <DashboardAssesmentListItem v-for="module in modules" :key="module.id" :module :assesments />
            </div>
            <div v-else class="flex h-full grow items-center justify-center">
                Add an assessment to get started
            </div>
            <div class="flex flex-row gap-2 p-2">
                <PopupAddAssesment>
                    <AppBtnPrimary class="p-4 w-full px-auto">
                        <Icon name="material-symbols:add-notes-outline-rounded" />
                        Add Assesment
                    </AppBtnPrimary>
                </PopupAddAssesment>
                <PopupAddModule>
                    <AppBtnPrimary aria-label="Add Module" title="Add Module" class="aspect-square flex justify-center">
                        <Icon name="material-symbols:create-new-folder-outline-rounded" />
                    </AppBtnPrimary>
                </PopupAddModule>
            </div>
        </div>
    </div>
</template>