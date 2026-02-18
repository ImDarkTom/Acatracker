<script setup lang="ts" generic="T extends keyof EventsForDate['events']">

defineProps<{
    text: string,
    dateEntry: EventsForDate,
    type: T,
}>();

defineSlots<{
    default(props: { event: NonNullable<EventsForDate['events'][T]>[number] }): any,
}>();
</script>

<template>
    <h3 class="text-lg">
        {{ text }}
    </h3>
    <ul
        class="flex flex-col gap-2">
        <li v-for="event in dateEntry.events[type]">
            <slot :event />
        </li>
    </ul>
</template>