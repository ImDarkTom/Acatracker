<script setup lang="ts">
import type { AssesmentSchema } from '~~/lib/db/schema';

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
            <div v-for="task in (tasks ?? []).filter((t) => t.assesment == (assesmentId as unknown as number | string))" class="p-2 bg-elevated rounded-sm flex flex-row gap-2">
                <input type="checkbox">
                <span>{{ task.name }}: {{ new Date(task.dueAt).toLocaleDateString() }}</span>
                <div v-if="task.description">
                    -
                    <span class="text-text-secondary">{{ task.description }}</span>
                </div>
            </div>
            <AddTaskBtn :assesment="assesment.data" @submitted="taskStore.refresh()" />
        </div>

        <div 
            class="text-lg p-2 bg-elevated rounded-sm">
            Due: {{ new Date(assesment.data.dueAt).toLocaleDateString() }}
        </div>

        <div class="flex flex-row gap-2">
            <input type="checkbox" name="" id="">Completed? (placeholder)
        </div>
    </div>
</template>