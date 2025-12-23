<script>
const date = ref(new Date());
</script>

<template>
    <label class="flex flex-col gap-2">
        <span>test</span>
        <DateFieldRoot
            v-slot="{ segments }"
            v-model:model-value="date"
            locale="gb"
            class="flex ring-1 focus:ring-2 ring-highlight focus:ring-brand-focus p-2 rounded-md">
            <template
                v-for="item in segments"
                :key="item.part">
                <DateFieldInput
                    v-if="item.part === 'literal'"
                    :part="item.part">
                    {{ item.value }}
                </DateFieldInput>
                <DateFieldInput
                    v-else
                    :part="item.part"
                    class="outline-none focus:bg-elevated">
                    {{ item.value }}
                </DateFieldInput>
            </template>
        </DateFieldRoot>
    </label>
</template>