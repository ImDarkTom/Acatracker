import type { UseFetchOptions } from "#app";
import { createAuthClient } from "better-auth/vue";

// Adapted: https://github.com/better-auth/better-auth/issues/5358#issuecomment-3411807797
const relativeFetch =(<T>(url: string, opts?: UseFetchOptions<T>) => {
    try {
        if (url.startsWith('http')) url = new URL(url).pathname;
    } catch {}
    return useFetch(url, opts);
});

const authClient = createAuthClient();

export const useAuthStore = defineStore("useAuthStore", () => {
    const session = ref<Awaited<ReturnType<typeof authClient.useSession>> | null>(null);

    async function init() {
        const data = await authClient.useSession(relativeFetch);
        session.value = data;
    }

    const user = computed(() => session.value?.data?.user);
    const isLoading = computed(() => session.value?.isPending);

    async function signIn() {
        await authClient.signIn.social({
            provider: "github",
            callbackURL: "/dashboard",
            errorCallbackURL: "/error",
        });
    }

    async function signOut() {
        await authClient.signOut();
        navigateTo("/");
    }

    return {
        init,
        isLoading,
        signIn,
        signOut,
        user,
    };
});