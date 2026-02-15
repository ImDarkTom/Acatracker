<script setup lang="ts">
const preferencesStore = useUserPreferencesStore();
const { preferences } = storeToRefs(preferencesStore);

const assessmentsStore = useAssessmentsStore();
const { assessments, pending, assessmentsCount } = storeToRefs(assessmentsStore);

const modulesStore = useModuleStore();
const { modules } = storeToRefs(modulesStore);

const isRefreshing = ref(false);

const activeModules = computed(() => modules.value?.filter((m) => {
    if (!preferences.value) return true;

    return m.year === preferences.value.currentYear
        && m.semester === preferences.value.currentSemester;
}));

function refresh() {
    isRefreshing.value = true;
    modulesStore.refresh();
    assessmentsStore.refresh();
}

const stopRefreshAnim = () => {
    isRefreshing.value = false;
}
</script>

<template>
    <div class="h-full flex flex-col gap-2 p-2 overflow-auto">
        <DashboardAssessmentListSemesterPicker />
        <div class="flex flex-row justify-between items-center">
            <span
                v-if="pending" 
                class="text-lg">
                ... Pending Assessment(s)
            </span>
            <span 
                v-else
                class="text-lg">
                {{ assessmentsCount.pending }} Pending Assessment(s)
            </span>
            <AppTooltip content="Refresh">
                <ButtonGhost
                    layer="base"
                    @click="refresh" 
                    :disabled="pending">
                    <Icon 
                        name="lucide:refresh-cw" 
                        :class="{
                            'animate-spin-once': isRefreshing
                        }"
                        @animationend="stopRefreshAnim" />
                </ButtonGhost>
            </AppTooltip>
        </div>
        <div 
            v-if="pending" 
            class="h-full flex items-center justify-center">
            <LoadingIcon size="32" />
        </div>
        <template v-else>
            <div v-if="!assessments || assessmentsCount.total === 0" class="flex h-full grow items-center justify-center">
                Add an assessment to get started
            </div>
            <div v-else-if="activeModules?.length === 0" class="flex h-full grow items-center justify-center">
                No modules/assessments added for year {{ preferences?.currentYear }}, semester {{ preferences?.currentSemester }}
            </div>
            <AccordionRoot 
                v-else
                class="flex grow flex-col gap-2 overflow-y-auto"
                type="multiple"
                :collapsible="true"
                :default-value="modules?.map(m => m.id.toString())">
                <DashboardAssessmentListItem 
                    v-for="module in activeModules" 
                    :key="module.id" 
                    :module 
                    :assessments="assessments.filter(a => a.moduleId === module.id)" />
            </AccordionRoot>
            <div class="flex flex-row gap-2">
                <PopupAddAssessment>
                    <ButtonSecondary class="p-4 w-full px-auto">
                        <Icon name="lucide:clipboard-list" />
                        Add Assessment
                    </ButtonSecondary>
                </PopupAddAssessment>
                <PopupAddModule>
                    <ButtonSecondary aria-label="Add Module" title="Add Module" class="aspect-square flex justify-center">
                        <Icon name="lucide:layers" />
                    </ButtonSecondary>
                </PopupAddModule>
            </div>
        </template>
    </div>
</template>