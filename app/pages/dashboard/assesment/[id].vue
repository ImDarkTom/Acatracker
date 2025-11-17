<script setup lang="ts">
import type { AssesmentSchema, TaskSchema } from '~~/lib/db/schema';

const { $csrfFetch } = useNuxtApp();
const route = useRoute();
const assesmentId = route.params.id;

const taskStore = useTaskStore();
const { tasks } = storeToRefs(taskStore);

const { assesments } = useAssesmentsStore();

const assesment = computed<{
    valid: false,
} | {
    valid: true,
    data: AssesmentSchema,
}>(() => {
    if (!assesments) return { valid: false };
    if (!assesmentId || typeof assesmentId === 'object' || isNaN(parseInt(assesmentId))) return { valid: false };
    
    const selectedAssesment = assesments.find((a) => a.id === parseInt(assesmentId));
    if (!selectedAssesment) return { valid: false };

    return { valid: true, data: selectedAssesment };
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

const assesmentCompletedLoading = ref(false);

async function toggleAssesmentCompleted() {
    if (!assesment.value.valid) return;
    assesment.value.data.completed = !assesment.value.data.completed;

    assesmentCompletedLoading.value = true;
    await $csrfFetch(`/api/assesments/${assesment.value.data.id}`, {
        method: 'PUT',
        body: {
            ...assesment.value.data,
        }
    });
    assesmentCompletedLoading.value = false;
}
</script>

<template>
    <div v-if="!assesment.valid">
        Invalid assesment.
    </div>
    <div v-else class="flex flex-col gap-2">
        <NuxtLink to="/dashboard">
            <AppBtnPrimary>
                <Icon name="material-symbols:arrow-back-rounded" size="20" />
                Back to calendar
            </AppBtnPrimary>
        </NuxtLink>
        <span class="text-3xl">{{ assesment.data.name }}</span>
        <p class="text-text-secondary">{{ assesment.data.description }}</p>
        <div 
            v-if="assesment.data.releasedAt" 
            class="text-lg p-2 bg-elevated rounded-sm">
            Release: {{ new Date(assesment.data.releasedAt).toLocaleDateString() }}
        </div>

        <div class="ml-8 mr-4 flex flex-col gap-2">
            <div 
                v-for="task in (tasks ?? []).filter((t) => t.assesment == (assesmentId as unknown as number | string))" 
                class="p-2 bg-elevated rounded-sm flex flex-col gap-2">
                <div class="flex flex-row items-center gap-2">
                    <input type="checkbox" @change="toggleTask(task)" :disabled="taskTogglesLoading.includes(task.id)">
                    <span>{{ task.name }}: {{ new Date(task.dueAt).toLocaleDateString() }}</span>
                    <div class="grow"></div>
                    <DropdownMenuRoot>
                        <DropdownMenuTrigger
                            class="rounded-sm data-[state='open']:bg-base hover:bg-elevated cursor-pointer p-2 size-8 flex items-center justify-center">
                            <Icon name="material-symbols:more-vert" size="24" />
                        </DropdownMenuTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuContent class="w-52 shadow-base shadow-sm bg-elevated rounded-md overflow-hidden mt-1">
                                <EditTaskBtn 
                                    :task 
                                    :assesment="assesment.data"
                                    class="h-full">
                                    <CustomDropdownItem 
                                        value="Edit" 
                                        icon="material-symbols:edit-outline-rounded"
                                        :select-action="(e) => e.preventDefault()" />
                                </EditTaskBtn>
                                <CustomDropdownItem 
                                    value="Delete" 
                                    icon="material-symbols:delete-outline-rounded"
                                    :select-action="() => taskStore.deleteTask(task)" />
                            </DropdownMenuContent>
                        </DropdownMenuPortal>
                    </DropdownMenuRoot>
                </div>
                <p v-if="task.description" class="text-sm text-text-secondary">{{ task.description }}</p>
            </div>
            <AddTaskBtn :assesment="assesment.data" @submitted="taskStore.refresh()" />
        </div>

        <div 
            class="text-lg p-2 bg-elevated rounded-sm">
            Due: {{ new Date(assesment.data.dueAt).toLocaleDateString() }}
        </div>

        <div class="flex flex-row gap-2">
            <input type="checkbox" @change="toggleAssesmentCompleted">
            <span class="text-lg">Completed</span>
        </div>
    </div>
</template>