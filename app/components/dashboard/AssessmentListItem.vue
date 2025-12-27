<script setup lang="ts">
import type { AssessmentSchema, ModuleSchema } from '~~/lib/db/schema';

defineProps<{
    module: ModuleSchema,
    assessments: AssessmentSchema[],
}>();

const { deleteAssessment } = useAssessmentsStore();
const { deleteModule } = useModuleStore();
</script>

<template>
    <div class="flex flex-col gap-1">
        <div class="flex flex-row justify-between items-center">
            <div class="flex flex-row gap-2 items-center">
                <code class="ring-1 ring-inset ring-text-secondary text-sm p-1 rounded-sm h-min">{{ module.code }}</code>
                <span class="text-lg">{{ module.name }}</span>
            </div>

            <DropdownMenuRoot>
                <DropdownMenuTrigger :as-child="true">
                    <ButtonGhost class="size-8 justify-center data-[state='open']:bg-bg-active">
                        <Icon name="material-symbols:more-vert" size="24" />
                    </ButtonGhost>
                </DropdownMenuTrigger>
                <DropdownMenuPortal>
                    <DropdownMenuContent class="dropdown-content">
                        <PopupEditModule :module>
                            <CustomDropdownItem 
                                value="Edit" 
                                icon="material-symbols:edit-outline-rounded"
                                @select="e => e.preventDefault()"/>
                        </PopupEditModule>
                        <CustomDropdownItem 
                            value="Delete" 
                            icon="material-symbols:delete-outline-rounded"
                            @select="deleteModule(module)" />
                    </DropdownMenuContent>
                </DropdownMenuPortal>
            </DropdownMenuRoot>
        </div>

        <div 
            v-for="assessment in assessments" 
            :key="assessment.id"
            class="flex flex-row items-center gap-2 card has-[>.active]:bg-bg-active"
            :class="{ 'opacity-65': assessment.completed }">
            <NuxtLink 
                class="grow"
                :to="`/dashboard/assessment/${assessment.id}`" 
                :exact-active-class="'active'"
                >
                <div class="flex flex-col group">
                    <span 
                        class="text-lg text-text group-hover:text-brand-focus transition-colors duration-75"
                        :class="{ 'line-through': assessment.completed }">{{ assessment.name }}</span>
                    <div class="flex flex-row gap-1 text-sm">
                        <span v-if="assessment.releasedAt">
                            {{ new Date(assessment.releasedAt).toLocaleDateString() }}
                        </span>

                        <div v-if="assessment.releasedAt" class="w-full h-px my-auto border-b-2 border-dotted"></div>

                        <span>
                            {{ new Date(assessment.dueAt).toLocaleDateString() }}
                        </span>
                    </div>
                </div>
            </NuxtLink>
            <div @click.stop>
                <DropdownMenuRoot>
                    <DropdownMenuTrigger
                        :as-child="true">
                        <ButtonGhost class="size-8 justify-center data-[state='open']:bg-bg-active">
                            <Icon name="material-symbols:more-vert" size="24" />
                        </ButtonGhost>
                    </DropdownMenuTrigger>
                    <DropdownMenuPortal>
                        <Transition name="fade">
                            <DropdownMenuContent class="dropdown-content">
                                <PopupEditAssessment :assessment>
                                    <CustomDropdownItem 
                                    value="Edit" 
                                    icon="material-symbols:edit-outline-rounded"
                                    @select="e => e.preventDefault()" />
                                </PopupEditAssessment>
                                <CustomDropdownItem 
                                    value="Delete" 
                                    icon="material-symbols:delete-outline-rounded"
                                    @select="deleteAssessment(assessment)" />
                            </DropdownMenuContent>
                        </Transition>
                    </DropdownMenuPortal>
                </DropdownMenuRoot>
            </div>
        </div>
    </div>
</template>