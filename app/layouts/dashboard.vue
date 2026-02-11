<template>
    <div class="h-screen flex flex-col">
        <DashboardNavBar />
        <div class="grow min-h-0 flex flex-col md:flex-row bg-bg-base">
            <div class="w-full min-h-[calc(50dvh-4rem)] border-highlight border-b-[0.5px]
                md:w-1/3 md:min-h-full md:border-r">
                <DashboardAssessmentList />
            </div>
            <div class="flex size-full p-2
                md:w-2/3 min-h-[calc(50dvh-4rem)] 
                md:min-h-full">
                <slot />
            </div>
        </div>
    </div>
</template>