<script setup lang="ts" generic="T extends EventTypeKey">

defineProps<{
    text: string,
    dateEntry: EventsForDate,
    type: T,
}>();

defineSlots<{
    default(props: { event: EventType<T> }): any
}>();
</script>

<template>
    <h3 class="text-lg text-text-muted">
        {{ text }}
    </h3>
    <ul
        class="flex flex-col gap-2">
        <li v-for="event in dateEntry.events[type]">
            <slot :event />
        </li>
    </ul>
</template>