import { fromDate, getLocalTimeZone, isSameDay } from "@internationalized/date";
import type { DateValue } from "reka-ui";
import type { ScheduleResponse } from "~~/lib/db/queries/modules";
import type { InsertAssessment, InsertTask } from "~~/lib/db/schema";

export type EventsForDate = {
    date: DateValue;
    events: {
        releasedAssessments?: { // This won't be included in the upcoming events list
            assessment: {
                slug: string;
                name: string;
                isCompleted: boolean;
            };
            module: {
                id: string; // TODO: use for filtering later on
                code: string;
                name: string;
            };
        }[];
        dueAssessments?: {
            assessment: {
                slug: string;
                name: string;
                isCompleted: boolean;
            };
            module: {
                id: string; // TODO: use for filtering later on
                code: string;
                name: string;
            };
        }[];
        dueTasks?: {
            task: {
                id: number;
                name: string;
                isCompleted: boolean;
            };
            assessment: {
                slug: string;
                name: string;
            };
            module: {
                id: string; // TODO: use for filtering later on
                code: string;
                name: string;
            };
        }[];
    };
};

export type EventTypeKey = keyof EventsForDate['events'];
export type EventType<T extends EventTypeKey> = NonNullable<EventsForDate['events'][T]>[number];

export const useScheduleStore = defineStore('useScheduleStore', () => {
    const { $csrfFetch } = useNuxtApp();
    const fetchWithCookies = useRequestFetch();

    const schedule = ref<Awaited<ScheduleResponse>>(null);
    const pending = ref(false);
    const error = ref<string | null>(null);

    async function fetchSchedule() {
        pending.value = true;
        error.value = null;
        
        try {
            schedule.value = await fetchWithCookies("/api/schedule");
        } catch (err) {
            error.value = (err as Error).message || "An error occurred while fetching the schedule.";
        } finally {
            pending.value = false;
        }
    }

    const refresh = fetchSchedule;

    function getAssessmentBySlug(slug: unknown) {
        return computed(() => {
            for (const module of schedule.value ?? []) {
                const match = module.assessments.find(a => a.slug === slug);
                if (match) return match;
            }
            return null;
        });
    }

    const assessmentsCount = computed(() => {
        if (!schedule.value) return { total: 0, pending: 0 };

        let total = 0;
        let pending = 0;
        for (const module of schedule.value) {
            total += module.assessments.length;
            pending += module.assessments.filter(a => !a.isCompleted).length
        }

        return { pending, total };
    });

    const upcomingEvents = computed<EventsForDate[]>(() => {
        if (!schedule.value) return [];

        const timezone = getLocalTimeZone();
        const eventsByDate: EventsForDate[] = [];

        const addEvent = <T extends EventTypeKey>(
            date: DateValue, 
            event: EventType<T>, 
            type: T
        ) => {
            let dateEntry: EventsForDate | undefined = eventsByDate.find(e => isSameDay(e.date, date));
            if (!dateEntry) {
                dateEntry = { date, events: {} };

                eventsByDate.push(dateEntry);
            }

            if (!dateEntry.events[type]) {
                dateEntry.events[type] = [];
            }

            (dateEntry.events[type] as EventType<T>[]).push(event as never);
        };

        for (const module of schedule.value) {
            for (const assessment of module.assessments) {
                if (assessment.releasedAt) {
                    addEvent<'releasedAssessments'>(
                        fromDate(new Date(assessment.releasedAt), timezone),
                        {
                            assessment: {
                                slug: assessment.slug,
                                name: assessment.name,
                                isCompleted: assessment.isCompleted ?? false,
                            },
                            module: {
                                id: module.id.toString(),
                                code: module.code,
                                name: module.name,
                            }
                        },
                        'releasedAssessments',
                    );
                }

                addEvent<'dueAssessments'>(
                    fromDate(new Date(assessment.dueAt), timezone),
                    {
                        assessment: {
                            slug: assessment.slug,
                            name: assessment.name,
                            isCompleted: assessment.isCompleted ?? false,
                        },
                        module: {
                            id: module.id.toString(),
                            code: module.code,
                            name: module.name,
                        },
                    },
                    'dueAssessments',
                );

                for (const task of assessment.tasks) {
                    addEvent<'dueTasks'>(
                        fromDate(new Date(task.dueAt), timezone),
                        {
                            task: {
                                id: task.id,
                                name: task.name,
                                isCompleted: task.isCompleted ?? false,
                            },
                            assessment: {
                                slug: assessment.slug,
                                name: assessment.name,
                            },
                            module: {
                                id: module.id.toString(),
                                code: module.code,
                                name: module.name,
                            }
                        },
                        'dueTasks',
                    );
                }
            }
        }

        // Sort events by date
        eventsByDate.sort((a, b) => a.date.compare(b.date));

        return eventsByDate;
    });


    const moduleOperations = {
        async add(values: Record<string, any>) {
            await $csrfFetch("/api/modules", {
                method: 'POST',
                body: values,
            });
    
            refresh();
        },
    
        async edit(values: Record<string, any>, moduleId: number) {
            await $csrfFetch(`/api/modules/${moduleId}`, {
                method: 'PUT',
                body: values,
            });
    
            refresh();
        },
    
        async delete(moduleId: number) {
            await $csrfFetch(`/api/modules/${moduleId}`, {
                method: 'DELETE'
            });
    
            refresh();
        },
    }

    const assessmentOperations = {
        async add(values: Record<string, any>) {
            await $csrfFetch("/api/assessments", {
                method: 'POST',
                body: values,
            });

            refresh();
        },

        async update(slug: string, values: Partial<InsertAssessment>) {
            await $csrfFetch(`/api/assessments/${slug}`, {
                method: 'PATCH',
                body: values,
            });

            refresh();
        },

        async toggleCompleted(slug: string, isCompleted: boolean) {
            await $csrfFetch(`/api/assessments/${slug}`, {
                method: 'PATCH',
                body: { isCompleted },
            });

            refresh();
        },

        // Delete
        async delete(slug: string) {
            await $csrfFetch(`/api/assessments/${slug}`, {
                method: 'DELETE'
            });

            refresh();
        },
    }

    // Tasks
    const taskOperations = {
        async add(values: Record<string, any>) {
            await $csrfFetch("/api/tasks", {
                method: 'POST',
                body: values,
            });

            refresh();
        },
        
        async update(values: Partial<InsertTask>, taskId: number) {
            await $csrfFetch(`/api/tasks/${taskId}`, {
                method: 'PATCH',
                body: values,
            });

            refresh();
        },
        
        async toggleCompleted(id: number, isCompleted: boolean) {
            await $csrfFetch(`/api/tasks/${id}`, {
                method: 'PATCH',
                body: { isCompleted },
            });

            refresh();
        },
        
        async delete(id: number) {
            await $csrfFetch(`/api/tasks/${id}`, {
                method: 'DELETE'
            });

            refresh();
        },
    };

    const calendarOperations = {
        eventsForDate(dateValue: DateValue): IterableEvent[] {
            if (!schedule.value) return [];

            const timezone = getLocalTimeZone();
            const events: IterableEvent[] = [];

            const isOnDate = (timestamp: number) => 
                isSameDay(dateValue, fromDate(new Date(timestamp), timezone));

            for (const module of schedule.value) {
                for (const assessment of module.assessments) {
                    const assessmentLabel = `${module.code} • ${assessment.name}`;

                    if (assessment.releasedAt && isOnDate(assessment.releasedAt)) {
                        events.push({
                            id: assessment.id.toString(),
                            type: 'released',
                            label: assessmentLabel,
                            isCompleted: assessment.isCompleted ?? false,
                            link: `/dashboard/assessment/${assessment.slug}#release`,
                        });
                    }

                    if (isOnDate(assessment.dueAt)) {
                        events.push({
                            id: assessment.id.toString(),
                            type: 'due',
                            label: assessmentLabel,
                            isCompleted: assessment.isCompleted ?? false,
                            link: `/dashboard/assessment/${assessment.slug}#due`,
                        });
                    }

                    for (const task of assessment.tasks) {
                        if (isOnDate(task.dueAt)) {
                            events.push({
                                type: 'task',
                                id: task.id.toString(),
                                label: `${module.code} • ${task.name}`,
                                isCompleted: task.isCompleted ?? false,
                                link: `/dashboard/assessment/${assessment.slug}#task-${task.id}`,
                            });
                        }
                    }
                }
            }

            return events;
        },
    };
        
    return {
        schedule,
        pending,
        error,
        refresh,
        fetchSchedule,
        getAssessmentBySlug,
        assessmentsCount,
        upcomingEvents,
        module: moduleOperations,
        assessment: assessmentOperations,
        task: taskOperations,
        calendar: calendarOperations,
    }
});