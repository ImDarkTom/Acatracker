<script setup lang="ts">
import { getLocalTimeZone, today, type DateValue } from '@internationalized/date';

const calendarStore = useCalendarStore();
const { eventsByDate } = storeToRefs(calendarStore);

const selectedDate = ref<DateValue | null>(today(getLocalTimeZone()));
function updateSelected(value: DateValue | undefined) {
    selectedDate.value = value ?? null;
}

function happeningOnDate(calDateRaw: DateValue) {
    const dateObject = calDateRaw.toDate(getLocalTimeZone());
    const timeUnix = dateObject.toISOString().split('T')[0]!;

    return eventsByDate.value.get(timeUnix) ?? [];
}

const assesmentsStore = useAssesmentsStore();
const { status, assesments } = storeToRefs(assesmentsStore);

const tasksStore = useTaskStore();
const { tasks } = storeToRefs(tasksStore);

onMounted(() => {
    tasksStore.refresh();
});
</script>

<template>
    <div v-if="status === 'pending'" class="flex items-center justify-center grow">
        <LoadingIcon size="32" />
    </div>
    <CalendarRoot
        v-if="(assesments && assesments.length > 0) || (tasks && tasks.length > 0)"
        v-slot="{ weekDays, grid }" 
        :default-value="today(getLocalTimeZone())"
        @update:model-value="updateSelected"
        :week-starts-on="1"
        :weekday-format="'short'"
        fixed-weeks
        class="h-full flex flex-col gap-2">
        <CalendarHeader class="flex items-center justify-around gap-2">
            <CalendarPrev class="size-8 flex items-center justify-center cursor-pointer hover:bg-elevated rounded-sm">
                <Icon name="material-symbols:chevron-left-rounded" size="24" />
            </CalendarPrev>

            <CalendarHeading class="select-none" />

            <CalendarNext class="size-8 flex items-center justify-center cursor-pointer hover:bg-elevated rounded-sm">
                <Icon name="material-symbols:chevron-right-rounded" size="24" />
            </CalendarNext>
        </CalendarHeader>
        <div class="h-full">
            <CalendarGrid 
                v-for="month in grid" 
                :key="month.value.toString()"
                class="h-full flex flex-col select-none">
                <CalendarGridHead>
                    <CalendarGridRow class="mb-1 grid w-full grid-cols-7">
                        <CalendarHeadCell 
                            v-for="day in weekDays" 
                            :key="day" >
                            {{ day }}
                        </CalendarHeadCell>
                    </CalendarGridRow>
                </CalendarGridHead>
                <CalendarGridBody class="grid h-full grid-rows-6">
                    <CalendarGridRow 
                        v-for="(weekDates, index) in month.rows" 
                        :key="`weekDate-${index}`"
                        class="grid grid-cols-7">
                        <CalendarCell 
                            v-for="weekDate in weekDates" 
                            :key="weekDate.toString()" 
                            :date="weekDate"
                            class="border border-text-secondary/20">
                            <CalendarCellTrigger 
                                :day="weekDate" 
                                :month="month.value"
                                class="flex justify-center p-1 ring-inset rounded-sm
                                hover:bg-elevated 
                                focus:ring-1 focus:ring-brand-50
                                data-selected:bg-brand-100! data-selected:text-surface 
                                data-today:font-semibold data-today:underline
                                data-outside-view:text-brand-50/30" />
                                <div class="mt-1">
                                    <RouterLink 
                                        v-for="(event, index) in happeningOnDate(weekDate)"
                                        :key="index"
                                        :to="event.link">
                                        <div 
                                            class="p-1 text-xs overflow-hidden text-ellipsis line-clamp-2 rounded-sm"
                                            :class="{
                                                'bg-red-500/20 text-red-500': event.type === 'due',
                                                'bg-green-500/20 text-green-500': event.type === 'released',
                                                'bg-amber-500/20 text-amber-500': event.type === 'task',
                                                'line-through opacity-60': event.completed
                                            }">
                                            {{ event.label }}
                                        </div>
                                    </RouterLink>
                                </div>
                        </CalendarCell>
                    </CalendarGridRow>
                </CalendarGridBody>
            </CalendarGrid>
        </div>
    </CalendarRoot>
    <div v-else
        class="m-1 bg-linear-to-br from-elevated to-elevated/80 min-h-[calc(100vh/2)] rounded-sm flex items-center justify-center select-none">
        Items will appear on the calendar once you add an assesment.
    </div>
</template>