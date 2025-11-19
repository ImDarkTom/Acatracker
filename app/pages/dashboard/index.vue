<script setup lang="ts">
const assesmentsStore = useAssesmentsStore();
const { status, assesments } = storeToRefs(assesmentsStore);
</script>

<template>
    <div v-if="status === 'pending'" class="flex items-center justify-center grow">
        <LoadingIcon size="32" />
    </div>
    <DashboardCalendar 
        v-else-if="assesments && assesments.length > 0" 
        :assesments />
    <div v-else
        class="m-1 bg-linear-to-br from-elevated to-elevated/80 min-h-[calc(100vh/2)] rounded-sm flex items-center justify-center select-none">
        Items will appear on the calendar once you add an assesment.
    </div>
</template>