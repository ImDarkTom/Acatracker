<script setup lang="ts">
import { getLocalTimeZone, today, type DateValue } from '@internationalized/date';
import type { AssesmentSchema } from '~~/lib/db/schema';

const { eventsOnDate } = useAssesmentsStore();

const props = defineProps<{
    assesments: AssesmentSchema[],
}>();

const selectedDate = ref<DateValue | null>(today(getLocalTimeZone()));
function updateSelected(value: DateValue | undefined) {
    selectedDate.value = value ?? null;
}

function happeningOnDate(calDateRaw: DateValue) {
    const events = eventsOnDate(calDateRaw);

    if (events.exist) {
        return events;
    } else {
        return {
            due: [],
            released: [],
        }
    }
}
</script>

<template>
    <CalendarRoot 
        v-slot="{ weekDays, grid }" 
        :default-value="today(getLocalTimeZone())"
        @update:model-value="updateSelected"
        :week-starts-on="1"
        :weekday-format="'short'"
        fixed-weeks
        class="h-full flex flex-col">
        <CalendarHeader class="flex items-center justify-between">
            <CalendarPrev class=" size-8 flex items-center justify-center cursor-pointer hover:bg-elevated rounded-sm">
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
                class="w-full h-full flex flex-col select-none">
                <CalendarGridHead>
                    <CalendarGridRow class="mb-1 grid w-full grid-cols-7">
                        <CalendarHeadCell 
                            v-for="day in weekDays" 
                            :key="day" >
                            {{ day }}
                        </CalendarHeadCell>
                    </CalendarGridRow>
                </CalendarGridHead>
                <CalendarGridBody class="grid h-full">
                    <CalendarGridRow 
                        v-for="(weekDates, index) in month.rows" 
                        :key="`weekDate-${index}`"
                        class="grid grid-cols-7">
                        <CalendarCell 
                            v-for="weekDate in weekDates" 
                            :key="weekDate.toString()" 
                            :date="weekDate"
                            class="flex flex-col border border-text-secondary/20">
                            <CalendarCellTrigger 
                                :day="weekDate" 
                                :month="month.value"
                                class="relative flex items-center justify-center w-full p-1 outline-none focus:ring-1 ring-inset focus:ring-brand-50 data-outside-view:text-brand-50/30 data-selected:bg-brand-100! data-selected:text-surface hover:bg-elevated data-unavailable:pointer-events-none data-unavailable:text-brand-50/50 data-unavailable:line-through data-today:font-semibold data-today:underline" />
                                <div class="flex flex-col mt-1">
                                    <div 
                                        v-for="event in happeningOnDate(weekDate).due" 
                                        :key="event.id"
                                        class="px-1 text-xs truncate bg-red-500/20 text-red-500">
                                        {{ event.name }}
                                    </div>
                                    <div 
                                        v-for="event in happeningOnDate(weekDate).released" 
                                        :key="event.id"
                                        class="px-1 text-xs truncate bg-green-500/20 text-green-500">
                                        {{ event.name }}
                                    </div>
                                </div>
                        </CalendarCell>
                    </CalendarGridRow>
                </CalendarGridBody>
            </CalendarGrid>
        </div>
    </CalendarRoot>
</template>