<script setup lang="ts">
const props = defineProps<{
    module: ModuleWithAssessments,
}>();

const scheduleStore = useScheduleStore();

function promptDeleteModule() {
    if (!confirm(`Are you sure you want to delete the '${props.module.name}' module?`)) return;

    scheduleStore.module.delete(props.module.id);
}

function promptDeleteAssessment(slug: string, name: string) {
    if (!confirm(`Are you sure you want to delete the '${name}' assessment?`)) return;
    
    scheduleStore.assessment.delete(slug);
}

const remainingAssessmentCount = computed(() => props.module.assessments.filter(a => !a.isCompleted).length);

const headerTooltipContent = computed(() => `${props.module.assessments.length} assessments, ${remainingAssessmentCount.value} remaining`);
</script>

<template>
    <AccordionItem :value="module.id.toString()">
        <AccordionHeader class="flex flex-row justify-between items-center pb-1">
            <div 
                class="flex flex-row gap-2 items-center select-none hover:text-text-primary"
                :class="{
                    'line-through text-text-muted ring-text-muted': module.assessments.length > 0 && remainingAssessmentCount == 0
                }">
                <code class="ring-1 ring-inset text-sm p-1 rounded-sm h-min">{{ module.code }}</code>
                <span class="text-lg">{{ module.name }}</span>
            </div>

            <div class="inline-flex gap-1 items-center">
                <AppTooltip :content="headerTooltipContent">
                    <span class="text-sm select-none min-w-max tracking-tighter leading-none mr-1">{{ module.assessments.length - remainingAssessmentCount }} / {{ module.assessments.length }}</span>
                </AppTooltip>

                <PopupAddAssessment :module>
                    <ButtonGhost layer="base">
                        <Icon name="lucide:plus" />
                    </ButtonGhost>
                </PopupAddAssessment>

                <AccordionTrigger 
                    class="group"
                    :disabled="module.assessments.length === 0"
                    :as-child="true">
                    <ButtonGhost class="size-8 justify-center" layer="base" :highlight-on-open="false">
                        <Icon 
                            name="lucide:chevron-down"
                            class="group-data-[state=open]:rotate-180 transition-discrete duration-150"
                            aria-label="Expand/Collapse" />
                    </ButtonGhost>
                </AccordionTrigger>

                <DropdownMenuRoot>
                    <DropdownMenuTrigger :as-child="true">
                        <ButtonGhost class="size-8 justify-center" layer="base">
                            <Icon name="lucide:ellipsis-vertical" />
                        </ButtonGhost>
                    </DropdownMenuTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuContent class="dropdown-content">
                            <PopupEditModule :module>
                                <CustomDropdownItem 
                                    value="Edit" 
                                    icon="lucide:pencil"
                                    @select="e => e.preventDefault()"/>
                            </PopupEditModule>
                            <CustomDropdownItem 
                                value="Delete" 
                                icon="lucide:trash-2"
                                @select="promptDeleteModule()" />
                        </DropdownMenuContent>
                    </DropdownMenuPortal>
                </DropdownMenuRoot>
            </div>
        </AccordionHeader>

        <AccordionContent
            class="overflow-hidden flex flex-col gap-1
                data-[state=open]:animate-accordion-content-slide-down
                data-[state=closed]:animate-accordion-content-slide-up">
            <div 
                v-for="assessment in module.assessments" 
                :key="assessment.id"
                class="flex flex-row items-center gap-2 p-2 rounded-lg bg-bg-surface hover:bg-bg-surface-hover has-[>.active]:bg-bg-surface-active ring-inset ring-[0.5px] ring-highlight"
                :class="{ 'opacity-75': assessment.isCompleted }">
                <NuxtLink 
                    class="grow"
                    :to="`/dashboard/assessment/${assessment.slug}`" 
                    :exact-active-class="'active'"
                    >
                    <div class="flex flex-col group">
                        <span 
                            class="text-lg text-text-primary group-hover:text-brand-focus transition-colors duration-75"
                            :class="{ 'line-through': assessment.isCompleted }">
                            {{ assessment.name }}
                        </span>
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
                            <ButtonGhost class="size-8 justify-center" layer="surface">
                                <Icon name="lucide:ellipsis-vertical" size="24" />
                            </ButtonGhost>
                        </DropdownMenuTrigger>
                        <DropdownMenuPortal>
                            <Transition name="fade">
                                <DropdownMenuContent class="dropdown-content">
                                    <PopupEditAssessment :assessment>
                                        <CustomDropdownItem 
                                            value="Edit" 
                                            icon="lucide:pencil"
                                            @select="e => e.preventDefault()" />
                                    </PopupEditAssessment>
                                    <CustomDropdownItem 
                                        value="Delete" 
                                        icon="lucide:trash-2"
                                        @select="promptDeleteAssessment(assessment.slug, assessment.name)" />
                                </DropdownMenuContent>
                            </Transition>
                        </DropdownMenuPortal>
                    </DropdownMenuRoot>
                </div>
            </div>
        </AccordionContent>
    </AccordionItem>
</template>