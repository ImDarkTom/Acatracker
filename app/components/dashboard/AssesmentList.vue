<script setup lang="ts">
const assesmentsStore = useAssesmentsStore();
const { status, assesments } = storeToRefs(assesmentsStore);

const modulesStore = useModuleStore();
const { modules } = storeToRefs(modulesStore);

function refresh() {
    modulesStore.refresh();
    assesmentsStore.refresh();
}
</script>

<template>
    <div class="h-full flex flex-col">
        <div v-if="status === 'pending'" class="h-full flex items-center justify-center">
            <LoadingIcon size="32" />
        </div>
        <template v-else>
            <div class="flex flex-row justify-between items-center">
                <span class="text-lg">{{ assesments?.filter(a => !a.completed)?.length ?? '?'  }} Pending Assessment(s)</span>
                <AppBtnSecondary @click="refresh">
                    <Icon name="material-symbols:refresh-rounded" size="24" />
                    Refresh
                </AppBtnSecondary>
            </div>
            <div v-if="assesments && assesments.length > 0" class="flex grow flex-col gap-2 overflow-y-auto">
                <DashboardAssesmentListItem v-for="module in modules" :key="module.id" :module :assesments />
            </div>
            <div v-else class="flex h-full grow items-center justify-center">
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
                    <AppBtnPrimary aria-label="Add Module" title="Add Module" class="aspect-square flex justify-center">
                        <Icon name="material-symbols:create-new-folder-outline-rounded" />
                    </AppBtnPrimary>
                </PopupAddModule>
            </div>
        </template>
    </div>
</template>