import { getLocalTimeZone } from "@internationalized/date";
import type { DateValue } from "reka-ui";

export function useCalendarEvents() {
    const { data: eventsByDate, pending, error, refresh } = useFetch('/api/calendar', { lazy: true });

    function getEventsForDate(dateValue: DateValue) {
        if (!eventsByDate.value) return [];

        const date = dateValue
            .toDate(getLocalTimeZone())
            .toISOString()
            .split('T')[0]!;

        return eventsByDate.value.find(e => e.date === date)?.events ?? [];
    }

    return {
        eventsByDate,
        pending,
        error,
        refresh,
        getEventsForDate,
    }
}