<template>
    <div class="h-screen flex flex-col">
        <DashboardNavBar />
        <div class="grow min-h-0 flex flex-row">
            <div class="flex flex-col gap-2 p-2">
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
            </div>
            <div class="grow flex flex-col md:flex-row bg-bg-base border-t border-l border-highlight rounded-tl-md">
                <div class="w-full min-h-[calc(50dvh-4rem)] border-highlight border-b-[0.5px]
                    md:w-1/3 md:min-h-full md:border-r-[0.5px]">
                    <DashboardAssessmentList />
                </div>
                <div class="flex size-full p-2
                    md:w-2/3 min-h-[calc(50dvh-4rem)] 
                    md:min-h-full">
                    <slot />
                </div>
            </div>
        </div>
    </div>
</template>