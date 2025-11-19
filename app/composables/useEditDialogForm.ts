import { FetchError } from "ofetch";

export function useEditDialogForm({ 
    meta,
    handleSubmit
}: Pick<ReturnType<typeof useForm>, 'meta' | 'handleSubmit'>) {
    const isOpen = ref(false);
    const isLoading = ref(false);
    const isSubmitted = ref(false);
    const submitError = ref('');

    const confirmBeforeExiting = computed(() => !isSubmitted.value && meta.value.dirty);

    const submitHandler = (
        submitFn: (values: any) => Promise<void>, 
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
            submitError.value = error.data?.statusMessage || error.statusMessage || 'An unknown error occured.';
        } finally {
            isLoading.value = false;
        }
    });
    
    onBeforeRouteLeave(() => {
        if (!isSubmitted.value && meta.value.dirty) {
            if (!confirm('Are you sure you want to leave? All unsaved changes will be lost.')) {
                return false;
            }
        }
        return true;
    });

    return {
        isLoading,
        submitError,
        submitHandler,
        confirmBeforeExiting,
    };
}