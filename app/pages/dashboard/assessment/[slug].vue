<script setup lang="ts">
import type { AssessmentWithDetails } from '~~/lib/db/queries/assessments';
import { formatRelativeTime, timeIsPast } from '~~/shared/utils/time';

definePageMeta({
    layout: 'dashboard',
});

const route = useRoute();
const slugFromParams = route.params.slug;

const assessmentsStore = useAssessmentsStore();
const taskStore = useTaskStore();

const { data: assessment, pending, error } = await assessmentsStore.getAssessmentBySlug(slugFromParams);

const assessmentBeingUpdated = ref(false);
const tasksBeingUpdated = ref<number[]>([]);

const assessmentName = computed<string>(() => {
    if (!assessment.value) return "Invalid Assessment";
    return assessment.value.name;
});

const assessmentState = computed<'unreleased' | 'due' | 'completed' | 'overdue'>(() => {
    if (assessment.value?.completed) {
        return 'completed';
    }

    if (assessment.value?.releasedAt) {
        if (!timeIsPast(assessment.value.releasedAt)) {
            return 'unreleased';
        }

        if (timeIsPast(assessment.value.dueAt)) {
            return 'overdue'
        }
    }

    return 'due';
});

async function toggleAssessmentCompleted() {
    if (!assessment.value) return;
    assessment.value.completed = !assessment.value.completed;

    assessmentBeingUpdated.value = true;

    await assessmentsStore.toggleAssessmentCompleted(
        assessment.value.slug,
        assessment.value.completed
    );

    assessmentBeingUpdated.value = false;
}

async function toggleTask(task: AssessmentWithDetails['tasks'][number]) {
    task.completed = !task.completed;

    tasksBeingUpdated.value.push(task.id);
    await taskStore.toggleTaskCompleted(task.id, task.completed);
    tasksBeingUpdated.value = tasksBeingUpdated.value.filter(t => t !== task.id);
}

useHead(() => ({
    title: `${assessmentName.value} | Assessment | Acatracker`
}));
</script>

<template>
    <div 
        v-if="pending" 
        class="grow flex items-center justify-center">
        <LoadingIcon />
    </div>
    <div 
        v-else-if="error || !assessment"
        class="grow flex flex-col gap-2 items-center justify-center">
        Oh no!: {{ error?.statusMessage ?? 'An unknown error occurred.' }}
        <RouterLink to="/dashboard">
            <ButtonPrimary>
                Back to dashboard
            </ButtonPrimary>
        </RouterLink>
    </div>
    <div 
        v-else 
        class="grow flex flex-col gap-2">
        <div class="flex flex-row gap-2">
            <NuxtLink to="/dashboard">
                <ButtonPrimary>
                    <Icon name="lucide:arrow-left" />
                    Back to calendar
                </ButtonPrimary>
            </NuxtLink>
            <PopupEditAssessment :assessment>
                <ButtonSecondary :disabled="assessmentBeingUpdated">
                    <Icon name="lucide:pencil" />
                    Edit
                </ButtonSecondary>
            </PopupEditAssessment>
        </div>
        
        <span class="text-3xl">{{ assessment.name }}</span>
        <p class="text-text-secondary">{{ assessment.description ?? '(No description)' }}</p>

        <div class="flex flex-row gap-2">
            <div 
                class="p-2 rounded-md ring-1 ring-inset flex flex-row gap-2 items-center select-none"
                :class="{
                    'ring-info-border bg-info-bg text-info-text': assessmentState === 'unreleased',
                    'ring-warning-border bg-warning-bg text-warning-text': assessmentState === 'due',
                    'ring-danger-border bg-danger-bg text-danger-text': assessmentState === 'overdue',
                    'ring-success-border bg-success-bg text-success-text': assessmentState === 'completed',
                }">
                <Icon v-if="assessmentState === 'unreleased'" name="lucide:book-lock" />
                <Icon v-else-if="assessmentState === 'due'" name="lucide:calendar-clock" />
                <Icon v-else-if="assessmentState === 'overdue'" name="lucide:clock-alert" />
                <Icon v-else name="lucide:circle-check" />
                <span class="capitalize">
                    {{ assessmentState }}
                </span>
            </div>
            <!-- <ButtonSecondary>
                Mark as complete
            </ButtonSecondary> -->
        </div>

        <div v-if="assessment.releasedAt" class="text-lg card bg-bg-surface rounded-sm">
            Release: {{ new Date(assessment.releasedAt).toLocaleDateString() }}
        </div>

        <div class="ml-8 mr-4 flex flex-col gap-2">
            <div 
                v-for="task in assessment.tasks"
                class="card bg-bg-surface rounded-sm flex flex-col gap-2">
                <div class="flex flex-row items-center justify-between">
                    <label class="w-full flex flex-row gap-2">
                        <input 
                            type="checkbox"
                            :checked="!!task.completed"
                            :disabled="tasksBeingUpdated.includes(task.id)"
                            @change="toggleTask(task)">
                        <div 
                            class="w-full flex flex-row select-none">
                            <span 
                                class="text-text-primary"
                                :class="{ 'line-through': !!task.completed }">
                                {{ task.name }}
                            </span>
                            <div class="ml-2">
                                <span>
                                    | {{ new Date(task.dueAt).toLocaleDateString() }} - 
                                </span>
                                <span 
                                    class="text-text-secondary"
                                    :class="{
                                        'text-warning-base': timeIsPast(task.dueAt)
                                    }">
                                    {{ formatRelativeTime(task.dueAt) }}
                                </span>
                            </div>
                        </div>
                    </label>
                    <DropdownMenuRoot>
                        <DropdownMenuTrigger
                            class="rounded-sm hover:bg-bg-surface-hover data-[state='open']:bg-bg-surface-active cursor-pointer p-2 size-8 flex items-center justify-center">
                            <Icon name="lucide:ellipsis-vertical" size="24" />
                        </DropdownMenuTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuContent
                                class="dropdown-content">
                                <PopupEditTask 
                                    :assessment
                                    :task>
                                    <CustomDropdownItem value="Edit" icon="lucide:pencil"
                                        :on-select="(e) => e.preventDefault()" />
                                </PopupEditTask>
                                <CustomDropdownItem value="Delete" icon="lucide:trash-2"
                                    :on-select="() => taskStore.deleteTask(task.id, task.name)" />
                            </DropdownMenuContent>
                        </DropdownMenuPortal>
                    </DropdownMenuRoot>
                </div>
                <p 
                    v-if="task.description"
                    class="text-sm text-text-secondary">{{ task.description }}</p>
            </div>
            <PopupAddTask :assessment >
                <ButtonPrimary class="w-full">
                    <Icon name="lucide:circle-check-big" />
                    Add Task
                </ButtonPrimary>
            </PopupAddTask>
        </div>

        <div class="text-lg card bg-bg-surface rounded-sm">
            Due: {{ new Date(assessment.dueAt).toLocaleDateString() }}
        </div>

        <label class="flex flex-row gap-2">
            <input 
                type="checkbox" 
                :checked="!!assessment.completed"
                @change="toggleAssessmentCompleted">
            <span class="text-lg">Completed</span>
        </label>
    </div>
</template>