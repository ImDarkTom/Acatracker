import { createAuthClient } from "better-auth/vue";

const authClient = createAuthClient();

export type ReturnedSession = Awaited<ReturnType<typeof authClient.useSession>>;

export const useAuthStore = defineStore("useAuthStore", () => {
    const session = ref<ReturnedSession['data'] | null>(null);

    function setSession(value: ReturnedSession['data'] | null) {
        session.value = value;
        if (session.value) {
            _isLoading.value = false;
        }
    }

    const user = computed(() => session.value?.user);
    const _isLoading = ref(true);
    const isLoading = computed(() => _isLoading || session.value);

    async function signIn() {
        await authClient.signIn.social({
            provider: "github",
            callbackURL: "/dashboard",
            errorCallbackURL: "/error",
        });
    }

    async function signOut() {
        await authClient.signOut();
        setSession(null);
        navigateTo("/");
    }

    return {
        setSession,
        isLoading,
        signIn,
        signOut,
        user,
    };
});