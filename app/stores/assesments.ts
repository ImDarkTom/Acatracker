import { CalendarDate, getLocalTimeZone } from "@internationalized/date";
import type { DateValue } from "reka-ui";
import type { AssesmentSchema } from "~~/lib/db/schema";

export const useAssesmentsStore = defineStore('useAssesmentsStore', () => {
    const { data, status, refresh } = useFetch('/api/assesments', { lazy: true });

    function eventsOnDate(date: DateValue | Date): { exist: false } | { exist: true, released: AssesmentSchema[], due: AssesmentSchema[] } {
        const calendarDate = date instanceof Date ? date : date.toDate(getLocalTimeZone());
        const targetTime = calendarDate.getTime();

        const hasEventsOnDay = !!data.value
            ?.some(i => i['dueAt'] === targetTime || i['releasedAt'] === targetTime);

        if (!hasEventsOnDay) {
            return { exist: false };
        }

        return {
            exist: true,
            released: data.value?.filter(a => a['releasedAt'] === targetTime) ?? [],
            due: data.value?.filter(a => a['dueAt'] === targetTime) ?? [],
        }
    }

    return {
        assesments: data,
        status,
        refresh,
        eventsOnDate,
    };
});