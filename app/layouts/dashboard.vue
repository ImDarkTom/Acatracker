<script setup lang="ts">
const uiStore = useUiStore();

await callOnce('schedule', async () => {
    const scheduleStore = useScheduleStore();
    await scheduleStore.fetchSchedule();
});

await callOnce('userPreferences', async () => {
    const preferences = useUserPreferencesStore();
    await preferences.fetchPreferences();
});
</script>

<template>
    <div class="h-screen flex flex-col">
        <DashboardNavBar />
        <div class="grow min-h-0 flex flex-row">
            <nav class="hidden sm:flex flex-col gap-2 p-2">
                <DashboardSidenavButton
                    label="Home"
                    icon="lucide:home"
                    to="/dashboard" />

                <DashboardSidenavButton
                    label="Calendar"
                    icon="lucide:calendar"
                    to="/dashboard/calendar" />

                <DashboardSidenavButton
                    label="Timeline"
                    icon="lucide:route"
                    to="/dashboard/timeline" />

                <button 
                    class="text-text-muted hover:text-text-secondary flex flex-col items-center gap-1 cursor-pointer group mt-auto"
                    @click="uiStore.collapseSidebar()">
                    <div class="group-hover:bg-bg-base rounded-md size-8 flex items-center justify-center">
                        <Icon 
                            :name="uiStore.sidebarCollapsed ? 'lucide:list-indent-increase' : 'lucide:list-indent-decrease'" 
                            size="22" />
                    </div>
                    <span class="text-xs font-medium">
                        {{ uiStore.sidebarCollapsed ? 'Expand' : 'Collapse' }}
                    </span>
                </button>
            </nav>
            <div class="sm:hidden w-full fixed bottom-0 pb-2 flex justify-center">
                <nav class="w-fit flex flex-row bg-bg-app p-2 px-6 gap-4 rounded-full">
                    <DashboardSidenavButton
                        label="Home"
                        icon="lucide:home"
                        to="/dashboard" />
                    
                    <DashboardSidenavButton
                        label="Calendar"
                        icon="lucide:calendar"
                        to="/dashboard/calendar" />
                        
                    <DashboardSidenavButton
                        label="Timeline"
                        icon="lucide:route"
                        to="/dashboard/timeline" />
                </nav>
            </div>
            <div class="grow flex flex-col md:flex-row bg-bg-base border-t sm:border-l border-highlight sm:rounded-tl-md">
                <div 
                    v-if="!uiStore.sidebarCollapsed"
                    class="w-full min-h-[calc(50dvh-4rem)] border-highlight border-b-[0.5px]
                    md:w-2/7 md:min-h-full md:border-r-[0.5px]">
                    <DashboardAssessmentList  />
                </div>
                <div class="flex size-full p-2
                    min-h-[calc(50dvh-4rem)] 
                    md:min-h-full
                    pb-20 sm:pb-0"
                    :class="{
                        'md:w-5/7': !uiStore.sidebarCollapsed,
                    }">
                    <slot />
                </div>
            </div>
        </div>
    </div>
</template>