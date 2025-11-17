import type { TaskSchema } from "~~/lib/db/schema";

export const useTaskStore = defineStore('useTaskStore', () => {
    const { data, status, refresh } = useFetch('/api/tasks', { lazy: true });

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
        deleteTask,
    };
});