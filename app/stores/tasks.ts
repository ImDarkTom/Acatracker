import type { InsertTask, TaskSchema } from "~~/lib/db/schema";

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

    async function updateTask(values: Partial<InsertTask>, taskId: number) {
        await $csrfFetch(`/api/tasks/${taskId}`, {
            method: 'PATCH',
            body: values,
        });

        refresh()
    }

    async function toggleTaskCompleted(id: number, completed: boolean) {
        await $csrfFetch(`/api/tasks/${id}`, {
            method: 'PATCH',
            body: { completed },
        });

        refresh()
    }

    async function deleteTask(id: number, name: string) {
        if (!confirm(`Are you sure you want to delete '${name}'?`)) return;

        await $fetch(`/api/tasks/${id}`, {
            method: 'DELETE'
        });
    
        refresh();
    }

    return {
        tasks: data,
        status,
        refresh,
        addTask,
        updateTask,
        toggleTaskCompleted,
        deleteTask,
    };
});