<script setup lang="ts">
const assesmentsStore = useAssesmentsStore();
const { status, assesments } = storeToRefs(assesmentsStore);

const modulesStore = useModuleStore();
const { modules } = storeToRefs(modulesStore);

function refresh() {
    modulesStore.refresh();
    assesmentsStore.refresh();
}

const isLoading = computed(() => status.value === 'pending');
</script>

<template>
    <div class="h-full flex flex-col gap-2">
        <div class="flex flex-row justify-between items-center card">
                <span
                    v-if="isLoading" 
                    class="text-lg">
                    ... Pending Assessment(s)
                </span>
                <span 
                    v-else
                    class="text-lg">
                    {{ assesments?.filter(a => !a.completed)?.length ?? '?'  }} Pending Assessment(s)
                </span>
                <ButtonOutlined @click="refresh" :disabled="isLoading">
                    <Icon name="material-symbols:refresh-rounded" size="24" />
                    Refresh
                </ButtonOutlined>
            </div>
        <div v-if="isLoading" class="h-full flex items-center justify-center">
            <LoadingIcon size="32" />
        </div>
        <template v-else>
            <div v-if="!assesments || (assesments && assesments.length < 0)" class="flex h-full grow items-center justify-center">
                Add an assessment to get started
            </div>
            <div v-else class="flex grow flex-col gap-2 overflow-y-auto">
                <DashboardAssesmentListItem 
                    v-for="module in modules" 
                    :key="module.id" 
                    :module 
                    :assesments />
            </div>
            <div class="flex flex-row gap-2">
                <PopupAddAssesment>
                    <ButtonSecondary class="p-4 w-full px-auto">
                        <Icon name="material-symbols:add-notes-outline-rounded" />
                        Add Assesment
                    </ButtonSecondary>
                </PopupAddAssesment>
                <PopupAddModule>
                    <ButtonSecondary aria-label="Add Module" title="Add Module" class="aspect-square flex justify-center">
                        <Icon name="material-symbols:create-new-folder-outline-rounded" />
                    </ButtonSecondary>
                </PopupAddModule>
            </div>
        </template>
    </div>
</template>