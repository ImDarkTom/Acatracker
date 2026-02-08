export const useAuth = () => {
    const { $authClient, $authSession } = useNuxtApp();

    const user = computed(() => $authSession.data?.value?.user);
    const isLoading = computed(() => $authSession.isPending);

    const signUpWithEmail = async (email: string, password: string, name: string) => {
        return await $authClient.signUp.email({
            email,
            password,
            name,
            callbackURL: '/dashboard',
        });
    }

    const signInWithEmail = async (email: string, password: string) => {
        return await $authClient.signIn.email({
            email,
            password,
            callbackURL: '/dashboard',
        });
    }

    const signInWithGitHub = async () => {
        await $authClient.signIn.social({
            provider: "github",
            callbackURL: "/dashboard",
            errorCallbackURL: "/error",
        });
    }

    const signOut = async () => {
        await $authClient.signOut();
    }

    const deleteAccount = async () => {
        await $authClient.deleteUser({
            callbackURL: '/',
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