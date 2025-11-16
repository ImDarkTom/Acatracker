<script setup lang="ts">
import type { AssesmentSchema } from '~~/lib/db/schema';

const route = useRoute();
const assesmentId = route.params.id;

const { assesments } = useAssesmentsStore();

const assesment = computed<{
    valid: false,
} | {
    valid: true,
    data: AssesmentSchema,
}>(() => {
    if (!assesments) return { valid: false };
    if (!assesmentId || typeof assesmentId === 'object' || isNaN(parseInt(assesmentId))) return { valid: false };
    
    const selectedAssesment = assesments.find((a) => a.id === parseInt(assesmentId));
    if (!selectedAssesment) return { valid: false };

    return { valid: true, data: selectedAssesment };
});

</script>

<template>
    <div v-if="!assesment.valid">
        Invalid assesment.
    </div>
    <div v-else>
        {{ assesment.data.name }}
    </div>
</template>