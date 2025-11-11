<script setup lang="ts">
import { CalendarDate, getLocalTimeZone, type DateValue } from '@internationalized/date';
import { assesment } from '~~/lib/db/schema';

const props = defineProps<{
    assesments: ReturnType<typeof useAssesmentsStore>['assesments'],
}>();

const now = new Date();
const todayDate = new CalendarDate(now.getFullYear(), now.getMonth() + 1, now.getDate());

function happeningOnDate(calDateRaw: DateValue, type: 'due' | 'released') {
    const calendarDate = calDateRaw.toDate(getLocalTimeZone());
    const targetTime = calendarDate.getTime();
    const key = type === 'due' ? 'dueAt' : 'releasedAt';

    return !!props.assesments?.some(i => i[key] === targetTime);

}
</script>

<template>
    <CalendarRoot 
        v-slot="{ weekDays, grid }" 
        :default-value="todayDate"
        class="p-4 h-full" 
        :week-starts-on="1"
        :weekday-format="'short'"
        fixed-weeks>
        <CalendarHeader class="flex items-center justify-between">
            <CalendarPrev class="cursor-pointer">
                <Icon name="bi:arrow-left" />
            </CalendarPrev>

            <CalendarHeading />

            <CalendarNext class="cursor-pointer">
                <Icon name="bi:arrow-right" />
            </CalendarNext>
        </CalendarHeader>
        <div class="flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <CalendarGrid v-for="month in grid" :key="month.value.toString()"
                class="w-full select-none">
                <CalendarGridHead>
                    <CalendarGridRow class="mb-1 grid w-full grid-cols-7">
                        <CalendarHeadCell v-for="day in weekDays" :key="day">
                            {{ day }}
                        </CalendarHeadCell>
                    </CalendarGridRow>
                </CalendarGridHead>
                <CalendarGridBody class="grid">
                    <CalendarGridRow v-for="(weekDates, index) in month.rows" :key="`weekDate-${index}`"
                        class="grid grid-cols-7">
                        <CalendarCell v-for="weekDate in weekDates" :key="weekDate.toString()" :date="weekDate"
                            class="text-center flex justify-center">
                            <CalendarCellTrigger 
                                :day="weekDate" 
                                :month="month.value"
                                class="relative flex items-center justify-center rounded-full size-8 md:size-12 outline-none focus:ring-1 ring-inset focus:ring-brand-50 data-outside-view:text-brand-50/30 data-selected:bg-brand-100! data-selected:text-surface hover:bg-elevated data-highlighted:bg-red-500 data-unavailable:pointer-events-none data-unavailable:text-brand-50/50 data-unavailable:line-through data-today:font-semibold data-today:underline"
                                :class="{ 
                                    'before:absolute before:block before:top-1 before:rounded-full before:size-1 md:before:size-2 before:bg-brand-500': happeningOnDate(weekDate, 'due')
                                }" />
                        </CalendarCell>
                    </CalendarGridRow>
                </CalendarGridBody>
            </CalendarGrid>
        </div>
    </CalendarRoot>
</template>