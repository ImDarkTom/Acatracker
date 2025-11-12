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

function happeningOnDate(calDateRaw: DateValue, type: 'due' | 'released') {
    const events = eventsOnDate(calDateRaw);
    if (!events.exist) return false;

    if (type === 'due') {
        return events.due.length > 0;
    } else {
        return events.released.length > 0;
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
        fixed-weeks>
        <CalendarHeader class="flex items-center justify-between">
            <CalendarPrev class=" size-8 flex items-center justify-center cursor-pointer hover:bg-elevated rounded-sm">
                <Icon name="bi:arrow-left" size="24" />
            </CalendarPrev>

            <CalendarHeading />

            <CalendarNext class="size-8 flex items-center justify-center cursor-pointer hover:bg-elevated rounded-sm">
                <Icon name="bi:arrow-right" size="24" />
            </CalendarNext>
        </CalendarHeader>
        <div class="flex flex-col pt-4">
            <CalendarGrid 
                v-for="month in grid" 
                :key="month.value.toString()"
                class="w-full select-none">
                <CalendarGridHead>
                    <CalendarGridRow class="mb-1 grid w-full grid-cols-7">
                        <CalendarHeadCell 
                            v-for="day in weekDays" 
                            :key="day" >
                            {{ day }}
                        </CalendarHeadCell>
                    </CalendarGridRow>
                </CalendarGridHead>
                <CalendarGridBody class="grid">
                    <CalendarGridRow 
                        v-for="(weekDates, index) in month.rows" 
                        :key="`weekDate-${index}`"
                        class="grid grid-cols-7">
                        <CalendarCell 
                            v-for="weekDate in weekDates" 
                            :key="weekDate.toString()" 
                            :date="weekDate"
                            class="text-center flex justify-center">
                            <CalendarCellTrigger 
                                :day="weekDate" 
                                :month="month.value"
                                class="relative flex items-center justify-center rounded-full size-8 md:size-12 outline-none focus:ring-1 ring-inset focus:ring-brand-50 data-outside-view:text-brand-50/30 data-selected:bg-brand-100! data-selected:text-surface hover:bg-elevated data-unavailable:pointer-events-none data-unavailable:text-brand-50/50 data-unavailable:line-through data-today:font-semibold data-today:underline"
                                :class="{ 
                                    'before:absolute before:block before:top-1.5 before:rounded-full before:size-1 md:before:size-1.5 before:bg-red-500': happeningOnDate(weekDate, 'due'),
                                    'before:absolute before:block before:top-1.5 before:rounded-full before:size-1 md:before:size-1.5 before:bg-teal-500': happeningOnDate(weekDate, 'released'),
                                }" />
                        </CalendarCell>
                    </CalendarGridRow>
                </CalendarGridBody>
            </CalendarGrid>
        </div>
    </CalendarRoot>
</template>