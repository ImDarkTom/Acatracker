<script setup lang="ts">
import { getLocalTimeZone, today } from '@internationalized/date';
import { formatRelativeTime } from '~~/shared/utils/time';

definePageMeta({
    layout: 'dashboard',
});

useHead({
    title: 'Home | Acatracker',
});

onMounted(() => {
    useUiStore().setLastOpenedView('/dashboard');
});

const scheduleStore = useScheduleStore();

const entries = computed(() => {
    const todayDate = today(getLocalTimeZone());

    type Buckets = Record<'upcoming' | 'overdue' | 'completed', EventsForDate[]>;
    const buckets: Buckets = { upcoming: [], overdue: [], completed: [] };

    const dueEntries = scheduleStore.upcomingEvents.filter(dateEntry => {
        return (dateEntry.events.dueAssessments || dateEntry.events.dueTasks);
    });

    const hasAnyDue = (entry: EventsForDate) => 
        (entry.events.dueAssessments?.length ?? 0) > 0 || (entry.events.dueTasks?.length ?? 0) > 0;

    for (const dateEntry of dueEntries) {
        const completed: EventsForDate = {
            date: dateEntry.date,
            events: {
                dueAssessments: dateEntry.events.dueAssessments?.filter(e => e.assessment.isCompleted),
                dueTasks: dateEntry.events.dueTasks?.filter(e => e.task.isCompleted),
            }
        };

        const incomplete: EventsForDate = {
            date: dateEntry.date,
            events: {
                dueAssessments: dateEntry.events.dueAssessments?.filter(e => !e.assessment.isCompleted),
                dueTasks: dateEntry.events.dueTasks?.filter(e => !e.task.isCompleted),
            }
        }

        if (hasAnyDue(completed)) {
            buckets.completed.push(completed);
        }

        if (hasAnyDue(incomplete)) {
            const key = dateEntry.date.compare(todayDate) < 0 ? 'overdue' : 'upcoming';
            buckets[key].push(incomplete);
        }
    }

    return buckets;
});

const localTimezone = getLocalTimeZone();
</script>

<template>
    <div class="flex flex-col gap-2 w-full max-w-xl mx-auto overflow-auto">
        <CollapsibleRoot v-if="entries.completed.length > 0">
            <CollapsibleTrigger :as-child="true">
                <span class="group text-text-muted hover:text-text-secondary data-[state=open]:text-text-primary
                    text-lg font-bold inline-flex items-center gap-2 cursor-pointer">
                    <Icon 
                        name="lucide:chevron-right"
                        class="group-data-[state=open]:rotate-90 transition-discrete duration-150"
                        aria-label="Expand/Collapse" />
                    <span class="inline-flex items-center gap-2">
                        <Icon name="lucide:check" />
                        <h2>Completed ({{ entries.completed.length }})</h2>
                    </span>
                </span>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <div class="flex flex-row gap-5">
                    <div class="ml-2 min-h-full w-px bg-text-muted"></div>
                    <div class="w-full flex flex-col gap-2">
                        <div 
                            v-for="dateEntry in entries.completed"
                            :key="dateEntry.date.toDate(localTimezone).toISOString()">
                            <h2 class="capitalize text-lg font-semibold text-text-secondary">
                                {{ formatRelativeTime(dateEntry.date.toDate(localTimezone).getTime()) }}
                            </h2>
                            
                            <DashboardHomeDueDateSection
                                v-if="dateEntry.events.dueAssessments"
                                text="Due Assessments"
                                :date-entry="dateEntry"
                                type="dueAssessments">
                                <template #default="{ event }">
                                    <DashboardHomeEventCard
                                        :module-code="event.module.code"
                                        :breadcrumbs="[ { label: event.module.name } ]"
                                        :title="event.assessment.name"
                                        :title-to="{ name: 'dashboard-assessment-slug', params: { slug: event.assessment.slug } }"
                                        :date="dateEntry.date.toDate(localTimezone).toLocaleDateString()"
                                        v-model:is-completed="event.assessment.isCompleted"
                                        @update:is-completed="scheduleStore.assessment.toggleCompleted(event.assessment.slug, $event)" />
                                </template>
                            </DashboardHomeDueDateSection>

                            <DashboardHomeDueDateSection
                                v-if="dateEntry.events.dueTasks"
                                text="Due Tasks"
                                :date-entry="dateEntry"
                                type="dueTasks">
                                <template #default="{ event }">
                                    <DashboardHomeEventCard
                                        :module-code="event.module.code"
                                        :breadcrumbs="[
                                            { label: event.module.name },
                                            { label: event.assessment.name, to: { name: 'dashboard-assessment-slug', params: { slug: event.assessment.slug } } },
                                        ]"
                                        :title="event.task.name"
                                        :title-to="{ name: 'dashboard-assessment-slug', params: { slug: event.assessment.slug }, query: { task: event.task.id } }"
                                        :date="dateEntry.date.toDate(localTimezone).toLocaleDateString()"
                                        v-model:is-completed="event.task.isCompleted"
                                        @update:is-completed="scheduleStore.task.toggleCompleted(event.task.id, $event)" />
                                </template>
                            </DashboardHomeDueDateSection>
                        </div>
                    </div>
                </div>
            </CollapsibleContent>
        </CollapsibleRoot>

        <CollapsibleRoot 
            v-if="entries.overdue.length > 0" 
            :default-open="true">
            <CollapsibleTrigger :as-child="true">
                <span class="group text-text-secondary hover:text-text-primary data-[state=open]:text-text-primary
                    text-lg font-bold inline-flex items-center gap-2 cursor-pointer">
                    <Icon 
                        name="lucide:chevron-right"
                        class="group-data-[state=open]:rotate-90 transition-discrete duration-150"
                        aria-label="Expand/Collapse" />
                        <span class="inline-flex items-center gap-2 text-warning-text">
                            <Icon name="lucide:clock-alert" />
                            <h2>Overdue Events ({{ entries.overdue.length }})</h2>
                        </span>
                </span>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <div class="flex flex-row gap-5">
                    <div class="ml-2 min-h-full w-px bg-warning-border"></div>
                    <div class="flex flex-col gap-2 w-full">
                        <div 
                            v-for="dateEntry in entries.overdue"
                            :key="dateEntry.date.toDate(localTimezone).toISOString()">
                            <h2 class="capitalize text-lg font-semibold text-text-secondary">
                                {{ formatRelativeTime(dateEntry.date.toDate(localTimezone).getTime()) }}
                            </h2>
                            
                            <DashboardHomeDueDateSection
                                v-if="dateEntry.events.dueAssessments"
                                text="Due Assessments"
                                :date-entry="dateEntry"
                                type="dueAssessments">
                                <template #default="{ event }">
                                    <DashboardHomeEventCard
                                        :module-code="event.module.code"
                                        :breadcrumbs="[ { label: event.module.name } ]"
                                        :title="event.assessment.name"
                                        :title-to="{ name: 'dashboard-assessment-slug', params: { slug: event.assessment.slug } }"
                                        :date="dateEntry.date.toDate(localTimezone).toLocaleDateString()"
                                        v-model:is-completed="event.assessment.isCompleted"
                                        @update:is-completed="scheduleStore.assessment.toggleCompleted(event.assessment.slug, $event)" />
                                </template>
                            </DashboardHomeDueDateSection>

                            <DashboardHomeDueDateSection
                                v-if="dateEntry.events.dueTasks"
                                text="Due Tasks"
                                :date-entry="dateEntry"
                                type="dueTasks">
                                <template #default="{ event }">
                                    <DashboardHomeEventCard
                                        :module-code="event.module.code"
                                        :breadcrumbs="[
                                            { label: event.module.name },
                                            { label: event.assessment.name, to: { name: 'dashboard-assessment-slug', params: { slug: event.assessment.slug } } },
                                        ]"
                                        :title="event.task.name"
                                        :title-to="{ name: 'dashboard-assessment-slug', params: { slug: event.assessment.slug }, query: { task: event.task.id } }"
                                        :date="dateEntry.date.toDate(localTimezone).toLocaleDateString()"
                                        v-model:is-completed="event.task.isCompleted"
                                        @update:is-completed="scheduleStore.task.toggleCompleted(event.task.id, $event)" />
                                </template>
                            </DashboardHomeDueDateSection>
                        </div>
                    </div>
                </div>
            </CollapsibleContent>
        </CollapsibleRoot>

        <h1 class="text-2xl font-bold text-text-primary mt-4">Upcoming Events</h1>

        <div v-if="scheduleStore.pending">
            <LoadingIcon size="32" />
        </div>
        <div v-else-if="entries.upcoming.length === 0 && scheduleStore.assessmentsCount.total > 0">
            <p class="text-center text-text-muted">
                No upcoming events! Great work keeping up with your assessments.
            </p>
        </div>
        <div v-else-if="entries.upcoming.length === 0 && scheduleStore.assessmentsCount.total === 0">
            <p class="text-center text-text-muted">
                It looks like you haven't added any assessments yet. Start by adding your assessments to keep track of your upcoming deadlines.
            </p>
        </div>
        <div v-else>
            <div 
                v-for="dateEntry in entries.upcoming"
                :key="dateEntry.date.toDate(localTimezone).toISOString()">
                <h2 class="capitalize text-lg font-semibold text-text-secondary">
                    {{ formatRelativeTime(dateEntry.date.toDate(localTimezone).getTime()) }}
                </h2>
                
                <DashboardHomeDueDateSection
                    v-if="dateEntry.events.dueAssessments"
                    text="Due Assessments"
                    :date-entry="dateEntry"
                    type="dueAssessments">
                    <template #default="{ event }">
                        <DashboardHomeEventCard
                            :module-code="event.module.code"
                            :breadcrumbs="[ { label: event.module.name } ]"
                            :title="event.assessment.name"
                            :title-to="{ name: 'dashboard-assessment-slug', params: { slug: event.assessment.slug } }"
                            :date="dateEntry.date.toDate(localTimezone).toLocaleDateString()"
                            v-model:is-completed="event.assessment.isCompleted"
                            @update:is-completed="scheduleStore.assessment.toggleCompleted(event.assessment.slug, $event)" />
                    </template>
                </DashboardHomeDueDateSection>

                <DashboardHomeDueDateSection
                    v-if="dateEntry.events.dueTasks"
                    text="Due Tasks"
                    :date-entry="dateEntry"
                    type="dueTasks">
                    <template #default="{ event }">
                        <DashboardHomeEventCard
                            :module-code="event.module.code"
                            :breadcrumbs="[
                                { label: event.module.name },
                                { label: event.assessment.name, to: { name: 'dashboard-assessment-slug', params: { slug: event.assessment.slug } } },
                            ]"
                            :title="event.task.name"
                            :title-to="{ name: 'dashboard-assessment-slug', params: { slug: event.assessment.slug }, query: { task: event.task.id } }"
                            :date="dateEntry.date.toDate(localTimezone).toLocaleDateString()"
                            v-model:is-completed="event.task.isCompleted"
                            @update:is-completed="scheduleStore.task.toggleCompleted(event.task.id, $event)" />
                    </template>
                </DashboardHomeDueDateSection>
            </div>
        </div>
    </div>
</template>