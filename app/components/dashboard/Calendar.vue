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
            <CalendarHeader class="flex items-center justify-around gap-2">
                <CalendarPrev class="size-8 flex items-center justify-center cursor-pointer hover:bg-elevated rounded-sm">
                    <Icon name="material-symbols:chevron-left-rounded" size="24" />
                </CalendarPrev>
                
                <CalendarHeading class="select-none" />
                
                <CalendarNext class="size-8 flex items-center justify-center cursor-pointer hover:bg-elevated rounded-sm">
                    <Icon name="material-symbols:chevron-right-rounded" size="24" />
                </CalendarNext>
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
                                class="border border-highlight 
                                group-first:first:rounded-tl-md
                                group-first:last:rounded-tr-md
                                group-last:first:rounded-bl-md
                                group-last:last:rounded-br-md">
                                <CalendarCellTrigger 
                                    :day="weekDate" 
                                    :month="month.value"
                                    class="size-6 text-center mx-auto rounded-full
                                    data-today:bg-text-secondary data-today:text-surface 
                                    data-outside-view:text-text-secondary/35 data-outside-view:hover:bg-elevated data-outside-view:cursor-pointer" />
                                <div class="mt-1">
                                    <RouterLink 
                                        v-for="event in getEventsForDate(weekDate)"
                                        :key="index"
                                        :to="event.link">
                                        <div 
                                            class="p-1 text-xs font-semibold overflow-hidden text-clip line-clamp-1 rounded-sm"
                                            :class="{
                                                'bg-red-500/40': event.type === 'due',
                                                'bg-green-500/40': event.type === 'released',
                                                'bg-amber-500/40': event.type === 'task',
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
        </CalendarRoot>
    </template>
</template>