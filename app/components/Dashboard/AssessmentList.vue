<script setup lang="ts">
const preferencesStore = useUserPreferencesStore();
const { preferences } = storeToRefs(preferencesStore);

const scheduleStore = useScheduleStore();
const { schedule: modules } = storeToRefs(scheduleStore);

const spinRefreshIcon = ref(false);

function refresh() {
    spinRefreshIcon.value = true;
    scheduleStore.refresh();
}

function stopRefreshAnim() {
    spinRefreshIcon.value = false;
}
</script>

<template>
    <div class="h-full flex flex-col gap-2 p-2 overflow-auto">
        <div class="flex flex-row justify-between items-center">
            <span 
                class="text-text-muted">
                <template v-if="scheduleStore.pending">
                    ... Pending Assessment(s)
                </template>
                <template v-else>
                    {{ scheduleStore.assessmentsCount.pending }} Pending Assessment(s)
                </template>
            </span>
            <AppTooltip content="Refresh">
                <ButtonGhost
                    layer="base"
                    @click="refresh" 
                    :disabled="scheduleStore.pending">
                    <Icon 
                        name="lucide:refresh-cw" 
                        :class="{
                            'animate-spin-once': spinRefreshIcon
                        }"
                        @animationend="stopRefreshAnim" />
                </ButtonGhost>
            </AppTooltip>
        </div>
        <div 
            v-if="scheduleStore.pending" 
            class="h-full flex items-center justify-center">
            <LoadingIcon size="32" />
        </div>
        <template v-else>
            <div 
                v-if="modules?.length === 0" 
                class="flex flex-col gap-2 h-full grow items-center justify-center">
                No modules added for year {{ preferences?.currentYear }}, semester {{ preferences?.currentSemester }}
                <PopupAddModule>
                    <ButtonPrimary>
                        Add a module
                    </ButtonPrimary>
                </PopupAddModule>
            </div>
            
            <AccordionRoot 
                v-else
                class="flex grow flex-col gap-2 overflow-y-auto"
                type="multiple"
                :collapsible="true"
                :default-value="modules?.map(m => m.id.toString())">
                <DashboardAssessmentListItem 
                    v-for="module in modules" 
                    :key="module.id" 
                    :module />
            </AccordionRoot>

            <PopupAddModule>
                <ButtonSecondary class="flex justify-center">
                    <Icon name="lucide:layers" />
                    Add Module
                </ButtonSecondary>
            </PopupAddModule>
        </template>
    </div>
</template>