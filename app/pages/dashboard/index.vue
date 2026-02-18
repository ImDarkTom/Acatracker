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
        <!-- <div class="flex flex-row gap-2">
            <input 
                type="text"
                placeholder="Search for modules, assessments, tasks..."
                class="w-full bg-bg-elevated p-2 rounded-md ring-1 ring-inset ring-highlight">
            <ButtonSecondary>
                <Icon name="lucide:filter" />
            </ButtonSecondary>

        </div> -->
        <h1 class="text-2xl font-bold">Upcoming Events</h1>

        <div 
            v-for="dateEntry in shownDateEntries"
            :key="dateEntry.date.toDate(localTimezone).toISOString()">
            <h2 class="capitalize text-lg font-semibold">
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
                            <span class="font-medium text-lg">
                                {{ event.assessment.name }}
                            </span>
                        </div>
                        
                        <div class="flex flex-col gap-2 justify-between items-end">
                            <span class="text-sm text-text-muted">
                                {{ dateEntry.date.toDate(localTimezone).toLocaleDateString() }}
                            </span>
                            <AppCheckbox />
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
                                    <span>{{ event.assessment.name }}</span>
                                </span>
                            </span>
                            <span class="font-medium text-lg">
                                {{ event.task.name }}
                            </span>
                        </div>

                        <div class="flex flex-col gap-2 justify-between items-end">
                            <span class="text-sm text-text-muted">
                                {{ dateEntry.date.toDate(localTimezone).toLocaleDateString() }}
                            </span>
                            <AppCheckbox />
                        </div>
                    </div>
                </template>
            </DashboardHomeDueDateSection>
        </div>
    </div>
</template>