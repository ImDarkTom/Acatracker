<script setup lang="ts">
const props = defineProps<{
    label: string;
    name: string;
    disabled?: boolean;
    error?: string;
}>();
</script>

<template>
    <fieldset>
        <legend>
            {{ props.label }}
        </legend>
        <Field
            as="select"
            :name
            :disabled
            class="w-full bg-elevated p-2 rounded-md" 
            :class="{ 
                'ring-1 ring-errortxt/50 ring-inset': props.error,
                'opacity-50': disabled,
            }">
            <slot />
        </Field>
        <p v-if="props.error" class="text-sm text-errortxt">
            {{ props.error }}
        </p>
    </fieldset>
</template>