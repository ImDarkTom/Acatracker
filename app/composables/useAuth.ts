export const useAuth = () => {
    const { $authClient, $authSession } = useNuxtApp();
    const { csrf } = useCsrf();

    const user = computed(() => $authSession.data?.value?.user);
    const isLoading = computed(() => $authSession.isPending);

    async function signInWithGitHub() {
        const headers = new Headers();
        headers.append('csrf-token', csrf);

        await $authClient.signIn.social({
            provider: "github",
            callbackURL: "/dashboard",
            errorCallbackURL: "/error",
            fetchOptions: { headers }
        });
    }

    async function signOut() {
        const headers = new Headers();
        headers.append('csrf-token', csrf);

        await $authClient.signOut({
            fetchOptions: {
                headers,
            }
        });
    }

    return {
        user,
        isLoading,
        signInWithGitHub,
        signOut,
    };
};