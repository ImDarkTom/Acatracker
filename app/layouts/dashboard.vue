<script setup lang="ts">
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
                <div class="w-full min-h-[calc(50dvh-4rem)] border-highlight border-b-[0.5px]
                    md:w-1/3 md:min-h-full md:border-r-[0.5px]">
                    <DashboardAssessmentList />
                </div>
                <div class="flex size-full p-2
                    md:w-2/3 min-h-[calc(50dvh-4rem)] 
                    md:min-h-full
                    pb-20 sm:pb-0">
                    <slot />
                </div>
            </div>
        </div>
    </div>
</template>