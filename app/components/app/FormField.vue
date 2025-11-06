<script setup lang="ts">
const props = defineProps<{
    label: string;
    name: string;
    disabled?: boolean;
    placeholder?: string;
    type?: 'text' | 'textarea' | 'date';
    error?: string;
}>();
</script>

<template>
    <fieldset>
        <legend>
            {{ props.label }}
        </legend>
        <Field
            :as="props.type === 'textarea' ? 'textarea' : 'input'"
            :name
            :disabled
            :type="props.type || 'text'" 
            :placeholder
            class="w-full bg-brand-900 p-2" 
            :class="{ 
                'ring-1 ring-errortxt/50 ring-inset': props.error,
                'opacity-50': disabled,
            }" />
        <p v-if="props.error" class="text-sm text-errortxt">
            {{ props.error }}
        </p>
    </fieldset>
</template>