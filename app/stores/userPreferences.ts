import type { InsertUserPreferences, UserPreferencesSchema } from "~~/lib/db/schema";

export const useUserPreferencesStore = defineStore('useUserPreferencesStore', () => {
    const { $csrfFetch } = useNuxtApp();

    const preferences = ref<ApiResponse<'/api/user/preferences', 'get'> | null>(null);
    const pending = ref(false);
    const error = ref<Error | null>(null);

    const requestWithCookies = useRequestFetch();

    async function fetchPreferences() {
        pending.value = true;
        error.value = null;

        try {
            const data = await requestWithCookies('/api/user/preferences');
            preferences.value = data;
        } catch (err) {
            error.value = err instanceof Error ? err : new Error(String(err));
        } finally {
            pending.value = false;
        }
    }

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
        error,
        fetchPreferences,
        updateUserPreferences,
    };
});