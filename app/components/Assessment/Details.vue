<script setup lang="ts">
import type { AssessmentWithTasks } from '~~/lib/db/queries/modules';
import { formatRelativeTime, timeIsPast } from '~~/shared/utils/time';

const props = defineProps<{
    assessment: AssessmentWithTasks,
}>();

const scheduleStore = useScheduleStore();

const assessmentBeingUpdated = ref(false);
const tasksBeingUpdated = ref<number[]>([]);


async function toggleTask(task: AssessmentWithTasks['tasks'][number]) {
    task.isCompleted = !task.isCompleted;

    tasksBeingUpdated.value.push(task.id);
    await scheduleStore.task.toggleCompleted(task.id, task.isCompleted);
    tasksBeingUpdated.value = tasksBeingUpdated.value.filter(t => t !== task.id);
}

async function toggleCompleted() {
    props.assessment.isCompleted = !props.assessment.isCompleted;

    assessmentBeingUpdated.value = true;

    await scheduleStore.assessment.toggleCompleted(
        props.assessment.slug,
        props.assessment.isCompleted
    );

    assessmentBeingUpdated.value = false;
}

const assessmentState = computed<'unreleased' | 'due' | 'completed' | 'overdue'>(() => {
    if (props.assessment.isCompleted) {
        return 'completed';
    }

    if (props.assessment.releasedAt) {
        if (!timeIsPast(props.assessment.releasedAt)) {
            return 'unreleased';
        }

        if (timeIsPast(props.assessment.dueAt)) {
            return 'overdue'
        }
    }

    return 'due';
});

function promptDeleteTask(task: AssessmentWithTasks['tasks'][number]) {
    if (!confirm(`Are you sure you want to delete '${task.name}'?`)) return;

    scheduleStore.task.delete(task.id);
}
</script>

<template>
    <div 
        class="grow flex flex-col gap-2">
        <div class="flex flex-row gap-2">
            <AppBackBtn />
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
            <ButtonSecondary
                @click="toggleCompleted"
                :disabled="assessmentBeingUpdated">
                Mark as complete
            </ButtonSecondary>
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
                            :checked="!!task.isCompleted"
                            :disabled="tasksBeingUpdated.includes(task.id)"
                            @change="toggleTask(task)">
                        <div 
                            class="w-full flex flex-row select-none">
                            <span 
                                class="text-text-primary"
                                :class="{ 'line-through': !!task.isCompleted }">
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
                                    <CustomDropdownItem 
                                        value="Edit" 
                                        icon="lucide:pencil"
                                        @select="e => e.preventDefault()" />
                                </PopupEditTask>
                                <CustomDropdownItem 
                                    value="Delete" 
                                    icon="lucide:trash-2"
                                    @select="promptDeleteTask(task)" />
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
    </div>
</template>
