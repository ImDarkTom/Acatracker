<script setup lang="ts">
import { Timeline, type TimelineItem, type TimelineGroup, type TimelineMarker } from 'vue-timeline-chart';
import 'vue-timeline-chart/style.css';

definePageMeta({
    layout: 'dashboard',
});

useHead({
    title: 'Timeline | Acatracker',
});

onMounted(() => {
    useUiStore().setLastOpenedView('/dashboard/timeline');
});

const scheduleStore = useScheduleStore();
const { schedule } = storeToRefs(scheduleStore);

const items = computed<TimelineItem[]>(() => {
    if (!schedule.value) return [];

    let items: TimelineItem[] = [];

    for (const module of schedule.value) {
        for (const assessment of module.assessments) {
            items.push({
                id: assessment.slug,
                type: 'point',
                start: assessment.dueAt,
                group: module.id.toString(),
                title: assessment.name,
            });

            for (const task of assessment.tasks) {
                items.push({
                    id: `task-${task.id}`,
                    type: 'point',
                    start: task.dueAt,
                    group: module.id.toString(),
                    title: task.name,
                });
            }
        }
    }

    return items;
});

const groups = computed<TimelineGroup[]>(() => {
    if (!schedule.value) return [];

    return schedule.value.map<TimelineGroup>((module) => ({
        id: module.id.toString(),
        label: module.name,
    }));
});

const markers: TimelineMarker[] = [
    {
        start: Date.now(),
        type: 'marker',
        id: 'current',
    },
];
</script>

<template>
    <div class="min-w-full min-h-full touch-none">
        <Timeline
            :items
            :groups
            :markers>
            <!-- <template #item="{ item }">
                <div class="absolute top-0 left-0 size-20 bg-red-500">
                    {{ item. }}
                </div>
            </template> -->
        </Timeline>
    </div>
</template>