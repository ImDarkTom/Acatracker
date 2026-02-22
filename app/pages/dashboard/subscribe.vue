<script setup lang="ts">
definePageMeta({
    layout: 'dashboard',
});

useHead({
    title: 'Subscribe | Acatracker',
});

const { data, error, pending } = useFetch('/api/token', { lazy: true });

const calendarIcsUrl = computed(() => `${useRequestURL().origin}/api/events/${data.value?.calendarToken}`);

const calendarWebcalUrl = computed(() => calendarIcsUrl.value.replace(/^https?:\/\//, 'webcal://'));

const googleCalUrl = computed(() => `https://calendar.google.com/calendar/u/0/r?cid=${encodeURIComponent(calendarIcsUrl.value)}`);


const copyLabel = ref('Copy');

function copyText() {
    navigator.clipboard.writeText(calendarIcsUrl.value);
    copyLabel.value = 'Copied!';

    setTimeout(() => {
        copyLabel.value = 'Copy';
    }, 1000);
}

const selectAll = (event: FocusEvent) => {
    (event.target as HTMLInputElement).select();
    copyText();
}

</script>

<template>
    <div v-if="pending">
        <LoadingIcon />
    </div>
    <div v-else-if="error || !data">
        Error occured getting calendar token: {{ error }}
    </div>
    <div 
        v-else
        class="grow flex flex-col gap-2 items-center justify-center">
        <AppBackBtn />
        <span class="mt-4">Subscribe to your calendar inside other apps:</span>
        <div class="w-full flex flex-row gap-2 justify-center">
            <a
                :href="googleCalUrl"
                target="_blank"
                class="card aspect-square flex flex-col gap-2 items-center justify-evenly">
                <Icon name="mdi:google" size="32" />
                <span class="w-min text-sm text-center">Google Calendar</span>
            </a>

            <a
                :href="calendarWebcalUrl"
                target="_blank"
                class="card aspect-square flex flex-col gap-2 items-center justify-evenly">
                <Icon name="lucide:calendar-sync" size="32" />
                <span class="text-sm">Webcal</span>
            </a>

            <a
                :href="calendarIcsUrl"
                download
                class="card aspect-square flex flex-col gap-2 items-center justify-evenly">
                <Icon name="lucide:calendar-arrow-down" size="32" />
                <span class="text-sm">ICS</span>
            </a>
        </div>
        <span class="mt-4">Or add manually as an ICAL:</span>
        <div class="flex flex-row gap-1">
            <input 
                type="text" 
                readonly 
                :value="calendarIcsUrl" 
                @focus="selectAll"
                class="w-full outline-none ring-1 focus:ring-2 ring-highlight focus:ring-brand-focus p-2 rounded-md">
            <ButtonPrimary @click="copyText" class="w-min">
                {{ copyLabel }}
            </ButtonPrimary>
        </div>
    </div>
</template>