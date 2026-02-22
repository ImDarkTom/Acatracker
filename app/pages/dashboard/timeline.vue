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

type CustomTimelineItem = {
    link: string;
    tooltip: string;
    itemType: 'release' | 'due' | 'task';
} & TimelineItem;

type CustomTimelineGroup = {
    code: string;
    assessmentCount: number;
} & TimelineGroup;


const items = computed<CustomTimelineItem[]>(() => {
    if (!schedule.value) return [];

    let items: CustomTimelineItem[] = [];

    for (const module of schedule.value) {
        for (const assessment of module.assessments) {
            items.push({
                id: `${assessment.slug}-due`,
                type: 'point',
                start: assessment.dueAt,
                group: module.id.toString(),
                title: assessment.name,
                link: `/dashboard/assessment/${assessment.slug}`,
                tooltip: assessment.name,
                itemType: 'due',
            });

            if (assessment.releasedAt) {
                items.push({
                    id: `${assessment.slug}-release`,
                    type: 'point',
                    start: assessment.releasedAt,
                    group: module.id.toString(),
                    title: assessment.name,
                    link: `/dashboard/assessment/${assessment.slug}`,
                    tooltip: assessment.name,
                    itemType: 'release',
                });
            }

            for (const task of assessment.tasks) {
                items.push({
                    id: `task-${task.id}`,
                    type: 'point',
                    start: task.dueAt,
                    group: module.id.toString(),
                    title: task.name,
                    link: `/dashboard/assessment/${assessment.slug}#task-${task.id}`,
                    tooltip: task.name,
                    itemType: 'task',
                });
            }
        }
    }

    return items;
});

const groups = computed<CustomTimelineGroup[]>(() => {
    if (!schedule.value) return [];

    return schedule.value.map<CustomTimelineGroup>((module) => ({
        id: module.id.toString(),
        label: module.name,
        code: module.code,
        assessmentCount: module.assessments.length,
    }));
});

const baseMarkers: TimelineMarker[] = [
    {
        start: Date.now(),
        type: 'marker',
        id: 'current',
        cssVariables: { '--item-background': 'var(--color-brand-muted)' }
    },
];

const mouseHoverPosition = ref<number | null>(null);

const markers = computed<TimelineMarker[]>(() => {
    if (!mouseHoverPosition.value) return baseMarkers;

    return [
        {
            type: 'marker',
            id: 'mousehover',
            start: mouseHoverPosition.value,
            cssVariables: { '--item-background': 'var(--color-highlight)' }
        },
        ...baseMarkers,
    ];
});

function onMousemoveTimeline({ time }: { time: number, event: MouseEvent }) {
    mouseHoverPosition.value = time;
}

function onMouseleaveTimeline() {
    mouseHoverPosition.value = null;
}
</script>

<template>
    <div 
        v-if="!schedule?.length || schedule?.length > 0"
        class="min-w-full min-h-full touch-none">
        <Timeline
            class="timeline"
            :items
            :groups
            :markers
            :max-viewport-duration="31556952000"
            @mousemove-timeline="onMousemoveTimeline"
            @mouseleave-timeline="onMouseleaveTimeline">
            <template #item="{ item }">
                <AppTooltip :content="item.tooltip">
                    <NuxtLink :to="item.link">
                        <div 
                            class="size-full"
                            :class="{
                                'bg-event-released saturate-75': item.itemType === 'release',
                                'bg-event-task saturate-75': item.itemType === 'task',
                                'bg-event-due saturate-75': item.itemType === 'due',
                            }">
                        </div>
                    </NuxtLink>
                </AppTooltip>
            </template>
            <template #marker="{ item }">
                <div class="text-sm self-end text-nowrap px-1 opacity-50">
                    {{ new Date(item.start).toLocaleDateString() }}
                </div>
            </template>
            <template #group-label="{ group }">
                <div class="absolute z-10 p-0.5 top-0 left-0 h-full flex flex-col gap-1 bg-linear-90 from-bg-base to-transparent">
                    <span>
                        <span class="text-xs ring-1 ring-inset p-0.5 rounded-sm mr-1">{{ group.code }}</span>
                        <span>{{ group.label }}</span>
                    </span>
                    <span class="text-xs">{{ group.assessmentCount }} assessment(s)</span>
                </div>
            </template>
        </Timeline>
    </div>
    <div 
        v-else
        class="w-full h-full flex items-center justify-center text-text-muted">
        Timeline will appear once you have assessments
    </div>
</template>

<style scoped>
.timeline:deep(.marker) {
    contain: unset;
    display: flex;
}
</style>