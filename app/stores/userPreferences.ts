import type { InsertUserPreferences, UserPreferencesSchema } from "~~/lib/db/schema";

export const useUserPreferencesStore = defineStore('useUserPreferencesStore', () => {
    const { data: preferences, pending, refresh, error } = useFetch('/api/user/preferences');
    const { $csrfFetch } = useNuxtApp();

    // ----
    // CRUD
    // ----
    async function updateUserPreferences(values: Partial<UserPreferencesSchema>) {
        // TODO: handle errors
        try {
            const newValues = await $csrfFetch<InsertUserPreferences>(`/api/user/preferences`, {
                method: 'PUT',
                body: values,
            });

            preferences.value = newValues;

            // If we updated either of these, refresh schedule
            if (values.currentSemester || values.currentYear) {
                useScheduleStore().refresh();
            }
        } catch (error) {
            console.error("Error setting user preferences.", error);
        }
    }

    return {
        preferences,
        pending,
        refresh,
        error,
        updateUserPreferences,
    };
});