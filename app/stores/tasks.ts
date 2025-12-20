import type { TaskSchema } from "~~/lib/db/schema";

export const useTaskStore = defineStore('useTaskStore', () => {
    const { data, status, refresh } = useFetch('/api/tasks', { lazy: true });
    const { $csrfFetch } = useNuxtApp();

    async function addTask(values: Record<string, any>) {
        await $csrfFetch("/api/tasks", {
            method: 'POST',
            body: values,
        });

        refresh();
    }

    async function editTask(values: Record<string, any>, taskId: number) {
        await $csrfFetch(`/api/tasks/${taskId}`, {
            method: 'PUT',
            body: values,
        });

        refresh()
    }

    async function deleteTask(task: TaskSchema) {
        if (!confirm(`Are you sure you want to delete '${task.name}'?`)) return;

        await $fetch(`/api/tasks/${task.id}`, {
            method: 'DELETE'
        });
    
        refresh();
    }

    return {
        tasks: data,
        status,
        refresh,
        addTask,
        editTask,
        deleteTask,
    };
});