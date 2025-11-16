<script setup lang="ts">
const props = defineProps<{
    label: string;
    name: string;
    disabled?: boolean;
    placeholder?: string;
    type?: 'text' | 'textarea' | 'date' | 'number' | 'checkbox';
    error?: string;
}>();
</script>

<template>
    <fieldset :class="{ 'flex flex-row gap-2': type === 'checkbox' }">
        <legend>
            {{ props.label }}
        </legend>
        <Field
            :as="props.type === 'textarea' ? 'textarea' : 'input'"
            :name
            :disabled
            :type="props.type || 'text'"
            :value="type === 'checkbox' ? true : undefined"
            :placeholder
            class="w-full bg-elevated p-2 rounded-md" 
            :class="{
                'w-4! size-8': type === 'checkbox',
                'ring-1 ring-errortxt/50 ring-inset': props.error,
                'opacity-50': disabled,
            }" />
        <p v-if="props.error" class="text-sm text-errortxt">
            {{ props.error }}
        </p>
    </fieldset>
</template>