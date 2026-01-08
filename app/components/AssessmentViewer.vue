<script setup lang="ts">
import type { AssessmentSchema, TaskSchema } from '~~/lib/db/schema';

const { $csrfFetch } = useNuxtApp();
const route = useRoute();
const assessmentId = route.params.id;

const taskStore = useTaskStore();
const { tasks } = storeToRefs(taskStore);

const { assessments } = useAssessmentsStore();

const assessment = computed<{
    valid: false,
} | {
    valid: true,
    data: AssessmentSchema,
}>(() => {
    if (!assessments) return { valid: false };
    if (!assessmentId || typeof assessmentId === 'object' || isNaN(parseInt(assessmentId))) return { valid: false };

    const selectedAssessment = assessments.find((a) => a.id === parseInt(assessmentId));
    if (!selectedAssessment) return { valid: false };

    return { valid: true, data: selectedAssessment };
});

const taskTogglesLoading = ref<number[]>([]);

async function toggleTask(task: TaskSchema) {
    task.completed = !task.completed;

    taskTogglesLoading.value.push(task.id);
    await $csrfFetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        body: {
            ...task,
        }
    });
    taskTogglesLoading.value = taskTogglesLoading.value.filter(t => t !== task.id);
}

const assessmentCompletedLoading = ref(false);

async function toggleAssessmentCompleted() {
    if (!assessment.value.valid) return;
    assessment.value.data.completed = !assessment.value.data.completed;

    assessmentCompletedLoading.value = true;
    await $csrfFetch(`/api/assessments/${assessment.value.data.id}`, {
        method: 'PUT',
        body: {
            ...assessment.value.data,
        }
    });
    assessmentCompletedLoading.value = false;
}
</script>

<template>
    <div v-if="!assessment.valid">
        Invalid assessment.
    </div>
    <div v-else class="flex flex-col gap-2">
        <div class="flex flex-row gap-2">
            <NuxtLink to="/dashboard">
                <ButtonPrimary>
                    <Icon name="lucide:arrow-left" />
                    Back to calendar
                </ButtonPrimary>
            </NuxtLink>
            <PopupEditAssessment :assessment="assessment.data">
                <ButtonSecondary>
                    <Icon name="lucide:pencil" />
                    Edit
                </ButtonSecondary>
            </PopupEditAssessment>
        </div>
        <span class="text-3xl">{{ assessment.data.name }}</span>
        <p class="text-text-secondary">{{ assessment.data.description }}</p>
        <div v-if="assessment.data.releasedAt" class="text-lg card bg-bg-active rounded-sm">
            Release: {{ new Date(assessment.data.releasedAt).toLocaleDateString() }}
        </div>

        <div class="ml-8 mr-4 flex flex-col gap-2">
            <div 
                v-for="task in (tasks ?? []).filter((t) => t.assessment === (assessmentId as unknown as number | string))"
                class="card bg-bg-active rounded-sm flex flex-col gap-2">
                <div class="flex flex-row items-center justify-between">
                    <label class="flex flex-row gap-2">
                        <input 
                            type="checkbox"
                            :checked="!!task.completed"
                            @change="toggleTask(task)" :disabled="taskTogglesLoading.includes(task.id)">
                        <span class="select-none" :class="{ 'line-through': !!task.completed }">{{ task.name }}: {{ new Date(task.dueAt).toLocaleDateString() }}</span>
                    </label>
                    <DropdownMenuRoot>
                        <DropdownMenuTrigger
                            class="rounded-sm data-[state='open']:bg-bg-focus cursor-pointer p-2 size-8 flex items-center justify-center">
                            <Icon name="lucide:ellipsis-vertical" size="24" />
                        </DropdownMenuTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuContent
                                class="dropdown-content">
                                <PopupEditTask 
                                    :task 
                                    :assessment="assessment.data">
                                    <CustomDropdownItem value="Edit" icon="lucide:pencil"
                                        :on-select="(e) => e.preventDefault()" />
                                </PopupEditTask>
                                <CustomDropdownItem value="Delete" icon="lucide:trash-2"
                                    :on-select="() => taskStore.deleteTask(task)" />
                            </DropdownMenuContent>
                        </DropdownMenuPortal>
                    </DropdownMenuRoot>
                </div>
                <p v-if="task.description" class="text-sm text-text-secondary">{{ task.description }}</p>
            </div>
            <PopupAddTask :assessment="assessment.data" >
                <ButtonPrimary class="w-full">
                    <Icon name="lucide:circle-check-big" />
                    Add Task
                </ButtonPrimary>
            </PopupAddTask>
        </div>

        <div class="text-lg card bg-bg-active rounded-sm">
            Due: {{ new Date(assessment.data.dueAt).toLocaleDateString() }}
        </div>

        <label class="flex flex-row gap-2">
            <input type="checkbox" :checked="!!assessment.data.completed"  @change="toggleAssessmentCompleted">
            <span class="text-lg">Completed</span>
        </label>
    </div>
</template>