<script setup lang="ts">
import { getLocalTimeZone } from '@internationalized/date';
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

const shownDateEntries = computed(() => {
    return scheduleStore.upcomingEvents.filter(dateEntry => {
        return dateEntry.events.dueAssessments || dateEntry.events.dueTasks
    });
})

const localTimezone = getLocalTimeZone();
</script>

<template>
    <div class="flex flex-col gap-2 w-full max-w-xl mx-auto overflow-auto">
        <h1 class="text-2xl font-bold">Upcoming Events</h1>

        <div v-if="scheduleStore.pending">
            <LoadingIcon size="32" />
        </div>
        <div v-else-if="shownDateEntries.length === 0 && scheduleStore.assessmentsCount.total > 0">
            <p class="text-center text-text-muted">
                No upcoming events! Great work keeping up with your assessments.
            </p>
        </div>
        <div v-else-if="shownDateEntries.length === 0 && scheduleStore.assessmentsCount.total === 0">
            <p class="text-center text-text-muted">
                It looks like you haven't added any assessments yet. Start by adding your assessments to keep track of your upcoming deadlines.
            </p>
        </div>
        <div v-else>
            <div 
                v-for="dateEntry in shownDateEntries"
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
                        <div class="card flex flex-row justify-between">
                            <div class="flex flex-col">
                                <span class="flex flex-row gap-2">
                                    <code class="ring-1 ring-inset text-xs p-1 rounded-sm h-min">{{ event.module.code }}</code>
                                    <span class="text-sm">{{ event.module.name }}</span>
                                </span>
                                <NuxtLink 
                                    class="font-medium text-lg hover:underline hover:text-text-primary"
                                    :to="{
                                        name: 'dashboard-assessment-slug',
                                        params: {
                                            slug: event.assessment.slug,
                                        },
                                    }">
                                    {{ event.assessment.name }}
                                </NuxtLink>
                            </div>
                            
                            <div class="flex flex-col gap-2 justify-between items-end">
                                <span class="text-sm text-text-muted">
                                    {{ dateEntry.date.toDate(localTimezone).toLocaleDateString() }}
                                </span>
                                <AppCheckbox
                                    v-model:checked="event.assessment.isCompleted"
                                    @click="scheduleStore.assessment.toggleCompleted(event.assessment.slug, !event.assessment.isCompleted)" />
                            </div>
                        </div>
                    </template>
                </DashboardHomeDueDateSection>

                <DashboardHomeDueDateSection
                    v-if="dateEntry.events.dueTasks"
                    text="Due Tasks"
                    :date-entry="dateEntry"
                    type="dueTasks">
                    <template #default="{ event }">
                        <div class="card flex flex-row justify-between">
                            <div class="flex flex-col">
                                <span class="text-text-muted ring-text-muted text-sm flex flex-row gap-2">
                                    <code class="ring-1 ring-inset text-xs p-1 rounded-sm h-min">{{ event.module.code }}</code>
                                    <span>
                                        <span>{{ event.module.name }}</span>
                                        /
                                        <NuxtLink
                                            class="hover:underline hover:text-text-primary"
                                            :to="{ 
                                                name: 'dashboard-assessment-slug', 
                                                params: { slug: event.assessment.slug } 
                                            }">
                                            {{ event.assessment.name }}
                                        </NuxtLink>
                                    </span>
                                </span>
                                <NuxtLink 
                                    class="font-medium text-lg hover:underline hover:text-text-primary"
                                    :to="{ 
                                        name: 'dashboard-assessment-slug', 
                                        params: { slug: event.assessment.slug }, 
                                        query: { task: event.task.id }
                                    }">
                                    {{ event.task.name }}
                                </NuxtLink>
                            </div>

                            <div class="flex flex-col gap-2 justify-between items-end">
                                <span class="text-sm text-text-muted">
                                    {{ dateEntry.date.toDate(localTimezone).toLocaleDateString() }}
                                </span>
                                <AppCheckbox 
                                    v-model:checked="event.task.isCompleted"
                                    @click="scheduleStore.task.toggleCompleted(event.task.id, !event.task.isCompleted)" />
                            </div>
                        </div>
                    </template>
                </DashboardHomeDueDateSection>
            </div>
        </div>
    </div>
</template>