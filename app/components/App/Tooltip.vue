<script setup lang="ts">
import type { TooltipRootProps } from 'reka-ui';

defineProps<{
    content: string,
} & TooltipRootProps>();
</script>

<template>
    <TooltipRoot>
        <TooltipTrigger :as-child="true">
            <slot />
        </TooltipTrigger>
        <TooltipPortal>
            <Transition name="fade">
                <TooltipContent
                    class="card px-3 py-2.5 bg-bg-active text-sm leading-none select-none z-200 shadow-shadow-base shadow-sm"
                    :side-offset="5">
                    {{ content }}
                    <TooltipArrow
                        class="fill-highlight" />
                </TooltipContent>
            </Transition>
        </TooltipPortal>
    </TooltipRoot>
</template>