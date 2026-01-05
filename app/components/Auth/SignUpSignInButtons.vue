<script setup lang="ts">
const route = useRoute()

const shouldShow = computed(() => {
    return route.name !== 'sign-up' && route.name !== 'sign-in'
});

</script>

<template>
    <div v-if="shouldShow" class="flex flex-row gap-2">
        <RouterLink to="/sign-in">
            <ButtonSecondary>
                Sign in
            </ButtonSecondary>
        </RouterLink>
        <RouterLink to="/sign-up">
            <ButtonPrimary>
                Sign up
            </ButtonPrimary>
        </RouterLink>
    </div>
</template>