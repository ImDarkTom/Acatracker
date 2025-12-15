<script setup lang="ts">
useHead({
    title: 'Subscribe | Acatracker',
})

const { data, error, pending } = useFetch('/api/token', { lazy: true });

const calendarUrl = computed(() => `${useRequestURL().origin}/api/events/${data.value?.calendarToken}`);

const copyLabel = ref('Copy');

function copyText() {
    navigator.clipboard.writeText(calendarUrl.value);
    copyLabel.value = 'Copied!';

    setTimeout(() => {
        copyLabel.value = 'Copy';
    }, 1000);
}
</script>

<template>
    <div class="w-full h-72 flex flex-row gap-4 my-auto max-w-md mx-auto">
        <div class="w-full bg-base rounded-lg">
            <div v-if="error || !data">
                Error occured getting calendar token: {{ error }}
            </div>
            <div v-else-if="pending">
                <LoadingIcon />
            </div>
            <div v-else class="h-full flex flex-col gap-2 items-center justify-between p-2">
                <span>Subscribe to your calendar inside other apps</span>
                <div class="flex flex-row gap-2">
                    <a
                        :href="`https://calendar.google.com/calendar/u/0/r?cid=${calendarUrl}`"
                        target="_blank">
                        <Icon name="mdi:google" size="32" />
                    </a>
                </div>
                <div class="flex flex-col gap-1 w-full">
                    Or add manually as an ICAL:
                    <input type="text" readonly :value="calendarUrl" class="bg-surface">
                    <ButtonPrimary @click="copyText" class="w-min">
                        {{ copyLabel }}
                    </ButtonPrimary>
                </div>
            </div>
        </div>
    </div>
</template>