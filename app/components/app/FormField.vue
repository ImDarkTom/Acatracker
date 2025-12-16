<script setup lang="ts">
const props = defineProps<{
    type?: 'text' | 'textarea' | 'date' | 'number' | 'checkbox';
    label: string;
    name: string;
    disabled?: boolean;
    placeholder?: string;
    error?: string;
}>();
</script>

<template>
    <label :class="{ 'flex flex-row gap-2': type === 'checkbox' }">
        <span>
            {{ props.label }}
        </span>
        <Field
            :as="props.type === 'textarea' ? 'textarea' : 'input'"
            :name
            :disabled
            :type="props.type || 'text'"
            :value="type === 'checkbox' ? true : undefined"
            :placeholder
            class="w-full outline-none ring-1 focus:ring-2 ring-highlight focus:ring-brand-300 p-2 rounded-md"
            :class="{
                'w-4! size-8': type === 'checkbox',
                'ring-errortxt!': props.error,
                'opacity-50': disabled,
            }" />
        <ErrorMessage :name class="text-sm text-errortxt" />
    </label>
</template>