<script setup lang="ts">
import { timeIsPast, formatRelativeTime } from '~~/shared/utils/time';

const props = defineProps<{
    assessment: AssessmentWithTasks,
}>();

const scheduleStore = useScheduleStore();
const route = useRoute();

const highlightedTaskId = computed(() => Number(route.query.task));

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

function getDateAsDDMM(date: string | number) {
    const dateObj = new Date(date);

    return String(dateObj.getDate()).padStart(2, '0') + "/" + String(dateObj.getMonth() + 1).padStart(2, '0')
}

const tasksGroupedByDate = computed(() => {
    const sortedTasks = props.assessment.tasks.sort((a, b) => a.dueAt - b.dueAt);

    return Object.entries(Object.groupBy(sortedTasks, (i) => new Date(i.dueAt).toISOString().split('T')[0]!))
        .map(([date, tasks]) => [getDateAsDDMM(date), tasks ?? []] as const);
});
</script>

<template>
    <div class="grow flex flex-col gap-2">
        <div class="flex flex-row gap-2">
            <AppBackBtn />
            <PopupEditAssessment :assessment>
                <ButtonSecondary :disabled="assessmentBeingUpdated">
                    <Icon name="lucide:pencil" />
                    Edit
                </ButtonSecondary>
            </PopupEditAssessment>
        </div>

        <div class="grow flex flex-col sm:flex-row gap-2 overflow-auto">
            <div class="flex flex-col gap-2 w-full">
                <span class="text-xl font-medium">Assessment</span>
                <h1 class="text-3xl font-semibold text-text-primary">{{ assessment.name }}</h1>
                
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

                <textarea 
                    class="text-text-secondary ring-1 ring-highlight m-2 p-2 rounded-md outline-none focus:ring-2 resize-y min-h-48"
                    placeholder="(No description)"
                    disabled>{{ assessment.description }}</textarea>
            </div>

            <div class="flex flex-col w-full">
                <div class="inline-flex justify-between">
                    <h2 class="text-2xl font-semibold">Timeline</h2>
                    <PopupAddTask :assessment>
                        <ButtonPrimary class="mb-2 w-fit px-4">
                            <Icon name="lucide:circle-check-big" />
                            Add Task
                        </ButtonPrimary>
                    </PopupAddTask>
                </div>
                
                
                <div 
                    v-if="assessment.releasedAt" 
                    class="flex flex-row gap-2 items-center select-none">
                    <div class="flex flex-col h-full min-w-16 items-center">
                        <div class="w-px h-full"></div>
                        <span class="select-none tracking-tight text-text-primary font-semibold">
                            {{ getDateAsDDMM(assessment.releasedAt) }}
                        </span>
                        <div class="w-px h-full border-txt-muted border-l border-dotted"></div>
                    </div>

                    <div 
                        class="card bg-bg-surface rounded-md p-4 w-full mb-2">
                        <div class="flex flex-col gap-2">
                            <div class="text-text-secondary text-sm">
                                <span>
                                    {{ new Date(assessment.releasedAt).toLocaleTimeString([], {
                                        hour: '2-digit', minute: '2-digit'
                                    }) }}
                                </span>
                                <span class="capitalize">
                                    / {{ formatRelativeTime(assessment.releasedAt) }}
                                </span>
                            </div>

                            <span class="text-text-primary leading-none text-lg font-semibold flex items-center gap-2">
                                <Icon name="lucide:book-open" class="text-text-secondary" />
                                Released
                            </span>
                        </div>
                    </div>
                </div>

                <div 
                    v-for="[date, tasks] in tasksGroupedByDate"
                    class="flex flex-row gap-2 items-center"
                    :key="date">

                    <div class="flex flex-col h-full min-w-16 items-center">
                        <div class="w-px h-full border-txt-muted border-l border-dotted"></div>
                        <span class="select-none tracking-tight text-text-primary">{{ date }}</span>
                        <div class="w-px h-full border-txt-muted border-l border-dotted"></div>
                    </div>

                    <ul class="flex flex-col gap-2 w-full my-2">
                        <li v-for="task in tasks"
                            class="card bg-bg-surface rounded-md flex flex-row justify-between gap-2 p-4" :class="{
                                'brightness-75': !!task.isCompleted,
                                'ring-1 ring-brand-focus': highlightedTaskId === task.id,
                            }">
                            <div class="flex flex-col gap-2">
                                <div class="text-text-secondary text-sm" :class="{
                                    'text-warning-base': timeIsPast(task.dueAt)
                                }">
                                    <span>
                                        {{ new Date(task.dueAt).toLocaleTimeString([], {
                                            hour: '2-digit', minute: '2-digit'
                                        }) }}
                                    </span>
                                    <span class="capitalize">
                                        / {{ formatRelativeTime(task.dueAt) }}
                                    </span>
                                </div>
                                <label 
                                    class="w-full flex flex-row gap-2 cursor-pointer rounded-xl ring-0 ring-bg-surface-hover transition-all duration-75
                                    hover:bg-bg-surface-hover hover:ring-8">
                                    <input 
                                        type="checkbox"
                                        class="accent-brand-base"
                                        :checked="!!task.isCompleted"
                                        :disabled="tasksBeingUpdated.includes(task.id)" 
                                        @change="toggleTask(task)">
                                    <span 
                                        class="text-text-primary leading-none text-lg"
                                        :class="{ 'line-through text-text-muted!': !!task.isCompleted }">
                                        {{ task.name }}
                                    </span>
                                </label>

                                <p v-if="task.description" class="ml-5.5 mt-1 text-sm text-text-secondary">
                                    {{ task.description }}
                                </p>
                            </div>

                            <DropdownMenuRoot>
                                <DropdownMenuTrigger
                                    class="rounded-sm hover:bg-bg-surface-hover data-[state='open']:bg-bg-surface-active cursor-pointer p-2 size-8 flex items-center justify-center">
                                    <Icon name="lucide:ellipsis-vertical" size="24" />
                                </DropdownMenuTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuContent class="dropdown-content">
                                        <PopupEditTask :assessment :task>
                                            <CustomDropdownItem value="Edit" icon="lucide:pencil"
                                                @select="e => e.preventDefault()" />
                                        </PopupEditTask>
                                        <CustomDropdownItem value="Delete" icon="lucide:trash-2"
                                            @select="promptDeleteTask(task)" />
                                    </DropdownMenuContent>
                                </DropdownMenuPortal>
                            </DropdownMenuRoot>
                        </li>
                    </ul>
                </div>

                <div class="flex flex-row gap-2 items-center select-none">
                    <div class="flex flex-col h-full min-w-16 items-center">
                        <div class="w-px h-full border-txt-muted border-l border-dotted"></div>
                        <span class="select-none tracking-tight text-text-primary font-semibold">
                            {{ getDateAsDDMM(assessment.dueAt) }}
                        </span>
                        <div class="w-px h-full"></div>
                    </div>

                    <div class="card bg-bg-surface rounded-md p-4 w-full mt-2">
                        <div class="flex flex-col gap-2">
                            <div 
                                class="text-text-secondary text-sm">
                                <span>
                                    {{ new Date(assessment.dueAt).toLocaleTimeString([], {
                                        hour: '2-digit', minute: '2-digit' 
                                    }) }}
                                </span>
                                <span class="capitalize">
                                    / {{ formatRelativeTime(assessment.dueAt) }}
                                </span>
                            </div>

                            <span class="text-text-primary leading-none text-lg font-semibold flex items-center gap-2">
                                <Icon name="lucide:clock-alert" class="text-text-secondary" />
                                Due
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
