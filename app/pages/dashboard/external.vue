<script setup lang="ts">
const { data, error, pending } = useCsrfFetch('/api/token');
</script>

<template>
    <div v-if="error || !data">
        Error occured getting calendar token: {{ error }}
    </div>
    <div v-else-if="pending">
        <LoadingIcon />
    </div>
    <div v-else class="h-full flex flex-col gap-2 items-center justify-center">
        <span>Subscribe to your calendar inside other apps</span>
        <div class="flex flex-row gap-2">
            <a :href="`https://calendar.google.com/calendar/u/0/r?cid=${useRequestURL().origin}/api/events/${data.calendarToken}`">
                <Icon name="mdi:google" size="32" />
            </a>
        </div>
    </div>
</template>