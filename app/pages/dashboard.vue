<template>
    <div class="w-full flex flex-col md:flex-row gap-4 md:max-h-[calc(100vh-7rem)]">
        <div class="w-full md:w-1/3 bg-base rounded-lg">
            <DashboardAssesmentList />
        </div>
        <div class="w-full md:w-2/3 bg-base rounded-lg p-2">
            <NuxtPage />
        </div>
    </div>
</template>