<script setup lang="ts">
import { getLocalTimeZone, today } from '@internationalized/date';

const { getEventsForDate, pending, error } = useCalendarEvents();
</script>

<template>
    <div v-if="pending" class="h-full flex items-center justify-center">
        <LoadingIcon size="32" />
    </div>
    <div v-if="error">
        Oh no! {{ error.statusMessage }}
    </div>
    <template v-if="!pending && !error">
        <CalendarRoot
            v-slot="{ weekDays, grid }" 
            :default-value="today(getLocalTimeZone())"
            :week-starts-on="1"
            :weekday-format="'short'"
            fixed-weeks
            class="h-full flex flex-col gap-2">
            <CalendarHeader class="flex items-center gap-2 p-2 pb-0">
                <AppTooltip content="Previous month">
                    <CalendarPrev :as-child="true">
                        <ButtonGhost>
                            <Icon name="lucide:chevron-left" />
                        </ButtonGhost>
                    </CalendarPrev>
                </AppTooltip>
                
                <AppTooltip content="Next month">
                    <CalendarNext :as-child="true">
                        <ButtonGhost>
                            <Icon name="lucide:chevron-right" />
                        </ButtonGhost>
                    </CalendarNext>
                </AppTooltip>
                
                <CalendarHeading class="select-none text-lg font-medium ml-1" />    
            </CalendarHeader>
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
                            class="grid grid-cols-7 group">
                            <CalendarCell 
                                v-for="weekDate in weekDates" 
                                :key="weekDate.toString()" 
                                :date="weekDate"
                                class="border-highlight border-t not-last:border-r">
                                <CalendarCellTrigger 
                                    :day="weekDate" 
                                    :month="month.value"
                                    class="size-6 text-center mx-auto rounded-full mt-0.5
                                    data-today:bg-text-secondary data-today:text-bg-muted 
                                    data-outside-view:text-text-secondary/35 data-outside-view:hover:bg-bg-active data-outside-view:cursor-pointer" />
                                <div class="mt-0.5">
                                    <DashboardCalendarEntry 
                                        v-for="(event, index) in getEventsForDate(weekDate)"
                                        :key="index"
                                        :eventProp="event" />
                                </div>
                            </CalendarCell>
                        </CalendarGridRow>
                    </CalendarGridBody>
                </CalendarGrid>
        </CalendarRoot>
    </template>
</template>