import { FetchError } from "ofetch";

export function useEditDialogForm({ 
    meta,
    handleSubmit,
}: Pick<ReturnType<typeof useForm>, 'meta' | 'handleSubmit'>, 
formSettings: {
    confirmBeforeExiting: boolean,
} = { 
    confirmBeforeExiting: true
}) {
    const isOpen = ref(false);
    const isLoading = ref(false);
    const isSubmitted = ref(false);
    const submitError = ref('');

    const confirmBeforeExiting = computed(() => {
        return !isSubmitted.value && meta.value.touched;
    });

    const submitHandler = (
        submitFn: (values: any) => void | Promise<void>, 
        setErrors: ReturnType<typeof useForm>['setErrors'], 
    ) => handleSubmit(async (values) => {
        try {
            submitError.value = "";
            isLoading.value = true;

            await submitFn(values);
            
            isSubmitted.value = true;
            isOpen.value = false;
        } catch (e) {
            const error = e as FetchError;
            if (error.data?.data) {
                setErrors(error.data.data);
            }
            submitError.value = error.data?.statusMessage || error.statusMessage || 'An unknown error occurred.';
        } finally {
            isLoading.value = false;
        }
    });
    
    if (formSettings.confirmBeforeExiting) {
        onBeforeRouteLeave(() => {
            if (confirmBeforeExiting.value) {
                if (!confirm('Are you sure you want to leave? All unsaved changes will be lost.')) {
                    return false;
                }
            }
            return true;
        });
    }

    return {
        isOpen,
        isLoading,
        submitError,
        submitHandler,
        confirmBeforeExiting,
    };
}