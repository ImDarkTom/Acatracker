<script setup lang="ts">

type BaseField = {
    label: string,
    name: string,
    sideBtn?: Component,
}

type FieldOptions = 
    { as: 'input', type: string }
    | { as: 'textarea' }
    | { as: 'select', optionsList: [any, string][], hintText: string }

defineProps<{
    onSubmit: () => void,
    isLoading: boolean,
    errors: Record<string, string | undefined>,
    submitBtn: {
        icon: string,
        label: string,
    },
    fields: (Record<string, any> & (BaseField & FieldOptions))[],
}>();
</script>

<template>
    <form class="flex flex-col gap-2" @submit.prevent="onSubmit">
        <div v-for="{ label, name, as: asType, type, ...attrs } in fields">
            <label>
                <span class="font-medium">
                    {{ label }}
                </span>
                <div class="flex flex-row gap-2">
                    <Field
                        :as="asType"
                        :name
                        :type
                        :disabled="isLoading"
                        :error="errors[name]"
                        v-bind="attrs"
                        class="w-full outline-none ring-1 focus:ring-2 ring-highlight focus:ring-brand-300 p-2 rounded-md"
                        :class="{
                            'ring-errortxt!': errors[name],
                            'opacity-50': isLoading,
                        }">
                        <template v-if="asType === 'select'">
                            <option value="" disabled selected>{{ attrs.hintText }}</option>
                            <option v-for="[value, label] in attrs.optionsList" :value>{{ label }}</option>
                        </template>
                    </Field>
                    <component v-if="attrs.sideBtn" :is="attrs.sideBtn" />
                </div>
                <ErrorMessage :name class="text-sm text-errortxt" />
            </label>
        </div>
        <div class="flex justify-end mt-2">
            <ButtonPrimary 
                type="submit" 
                :disabled="isLoading">
                <Icon v-if="!isLoading" :name="submitBtn.icon" />
                <LoadingIcon v-else />
                {{ submitBtn.label }}
            </ButtonPrimary>
        </div>
    </form>
</template>