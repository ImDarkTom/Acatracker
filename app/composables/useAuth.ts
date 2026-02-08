export const useAuth = () => {
    const { $authClient, $authSession } = useNuxtApp();
    const { csrf } = useCsrf();

    const user = computed(() => $authSession.data?.value?.user);
    const isLoading = computed(() => $authSession.isPending);

    const signUpWithEmail = async (email: string, password: string, name: string) => {
        const headers = new Headers();
        headers.append('csrf-token', csrf);

        return await $authClient.signUp.email({
            email,
            password,
            name,
            callbackURL: '/dashboard',
            fetchOptions: { headers }
        });
    }

    const signInWithEmail = async (email: string, password: string) => {
        const headers = new Headers();
        headers.append('csrf-token', csrf);

        return await $authClient.signIn.email({
            email,
            password,
            callbackURL: '/dashboard',
            fetchOptions: { headers }
        });
    }

    const signInWithGitHub = async () => {
        const headers = new Headers();
        headers.append('csrf-token', csrf);

        await $authClient.signIn.social({
            provider: "github",
            callbackURL: "/dashboard",
            errorCallbackURL: "/error",
            fetchOptions: { headers }
        });
    }

    const signOut = async () => {
        const headers = new Headers();
        headers.append('csrf-token', csrf);

        await $authClient.signOut({
            fetchOptions: { headers }
        });
    }

    const deleteAccount = async () => {
        const headers = new Headers();
        headers.append('csrf-token', csrf);

        await $authClient.deleteUser({
            callbackURL: '/',
            fetchOptions: { headers }
        });
    }

    return {
        user,
        isLoading,
        
        signUpWithEmail,

        signInWithEmail,
        signInWithGitHub,

        signOut,

        deleteAccount,
    };
};