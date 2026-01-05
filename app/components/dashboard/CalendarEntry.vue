<script setup lang="ts">
const props = defineProps<{
    eventProp: IterableEvent,
}>();

const { toggleAssessmentCompleted } = useAssessmentsStore();

const eventTypeMap = {
    due: 'Due Date',
    released: 'Release Date',
    task: 'Task',
};

const infoOpened = ref(false);

const onToggleCompleted = (e: Event) => toggleAssessmentCompleted(props.eventProp.id, (e.target as HTMLInputElement).checked);
</script>

<template>
    <PopoverRoot v-model:open="infoOpened">
        <PopoverTrigger :as-child="true">
            <div 
                class="p-1 text-text-primary text-xs overflow-hidden text-clip line-clamp-1 rounded-sm cursor-pointer"
                :class="{
                    'bg-event-due/40 hover:bg-event-due/50': eventProp.type === 'due',
                    'bg-event-due/60!': eventProp.type === 'due' && infoOpened,

                    'bg-event-released/40 hover:bg-event-released/50': eventProp.type === 'released',
                    'bg-event-released/60!': eventProp.type === 'released' && infoOpened,

                    'bg-event-task/40 hover:bg-event-task/50': eventProp.type === 'task',
                    'bg-event-task/60!': eventProp.type === 'task' && infoOpened,

                    'line-through opacity-60': eventProp.completed,
                }">
                {{ eventProp.label }}
            </div>
        </PopoverTrigger>
        <PopoverPortal>
            <PopoverContent
                :avoid-collisions="true"
                :collision-padding="8"
                :side-offset="8"
                class="card bg-bg-active flex flex-col gap-2 shadow-md shadow-shadow-base p-4 pr-10 min-w-60 max-w-md animate-dynamic-slide">
                <span :class="{
                    'text-event-due': eventProp.type === 'due',
                    'text-event-released': eventProp.type === 'released',
                    'text-event-task': eventProp.type === 'task',
                }">{{ eventTypeMap[eventProp.type] }}</span>
                <span class="font-medium text-text-primary text-lg">{{ eventProp.label }}</span>
                <label class="flex flex-row gap-2">
                    <span>Completed?</span>
                    <input 
                        type="checkbox" 
                        :checked="eventProp.completed" 
                        @change="onToggleCompleted">
                </label>
                <RouterLink :to="eventProp.link">
                    <ButtonPrimary>
                    View Details
                    </ButtonPrimary>
                </RouterLink>
                <PopoverArrow class="fill-highlight" />
                <PopoverClose class="absolute top-2 right-2">
                    <div class="inline-flex cursor-pointer rounded-full p-2 hover:bg-highlight active:bg-bg-focus">
                        <Icon name="lucide:x" size="20" />
                    </div>
                </PopoverClose>
            </PopoverContent>
        </PopoverPortal>
    </PopoverRoot>
</template>