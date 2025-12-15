<script setup lang="ts">
import type { AssesmentSchema, ModuleSchema } from '~~/lib/db/schema';

const assesmentsStore = useAssesmentsStore();
const modulesStore = useModuleStore();

defineProps<{
    module: ModuleSchema,
    assesments: AssesmentSchema[],
}>();

async function deleteAssesment(assesment: AssesmentSchema) {
    if (!confirm(`Are you sure you want to delete '${assesment.name}'?`)) return;

    await $fetch(`/api/assesments/${assesment.id}`, {
        method: 'DELETE'
    });

    assesmentsStore.refresh();
}

async function deleteModule(module: ModuleSchema) {
    if (!confirm(`Are you sure you want to delete the '${module.name}' module?`)) return;

    await $fetch(`/api/modules/${module.id}`, {
        method: 'DELETE'
    });

    modulesStore.refresh();
}
</script>

<template>
    <div class="flex flex-col gap-1">
        <div class="flex flex-row justify-between items-center">
            <div class="flex flex-row gap-2 items-center">
                <code class="ring-1 ring-inset ring-text-secondary text-sm p-1 rounded-sm h-min">{{ module.code }}</code>
                <span class="text-lg">{{ module.name }}</span>
            </div>

            <DropdownMenuRoot>
                <DropdownMenuTrigger
                    class="rounded-sm data-[state='open']:bg-base hover:bg-elevated cursor-pointer p-2 size-8 flex items-center justify-center">
                    <Icon name="material-symbols:more-vert" size="24" />
                </DropdownMenuTrigger>
                <DropdownMenuPortal>
                    <DropdownMenuContent class="w-52 shadow-black shadow-sm bg-elevated card p-1 rounded-md overflow-hidden mt-1">
                        <PopupEditModule :module>
                            <CustomDropdownItem 
                                value="Edit" 
                                icon="material-symbols:edit-outline-rounded"
                                :select-action="(e) => e.preventDefault()" />
                        </PopupEditModule>
                        <CustomDropdownItem 
                            value="Delete" 
                            icon="material-symbols:delete-outline-rounded"
                            :select-action="() => deleteModule(module)" />
                    </DropdownMenuContent>
                </DropdownMenuPortal>
            </DropdownMenuRoot>
        </div>

        <div 
            v-for="assesment in assesments.filter(a => a.module === module.id)" 
            :key="assesment.id"
            class="flex flex-row items-center gap-2 card has-[>.active]:bg-elevated"
            :class="{ 'opacity-65': assesment.completed }">
            <NuxtLink 
                class="grow"
                :to="`/dashboard/assessment/${assesment.id}`" 
                :exact-active-class="'active'"
                >
                <div class="flex flex-col group">
                    <span 
                        class="text-lg text-text group-hover:text-brand-200"
                        :class="{ 'line-through': assesment.completed }">{{ assesment.name }}</span>
                    <div class="flex flex-row gap-1 text-sm">
                        <span v-if="assesment.releasedAt">
                            {{ new Date(assesment.releasedAt).toLocaleDateString() }}
                        </span>

                        <div v-if="assesment.releasedAt" class="w-full h-px my-auto border-b-2 border-dotted"></div>

                        <span>
                            {{ new Date(assesment.dueAt).toLocaleDateString() }}
                        </span>
                    </div>
                </div>
            </NuxtLink>
            <div @click.stop>
                <DropdownMenuRoot>
                    <DropdownMenuTrigger
                        class="rounded-sm data-[state='open']:bg-elevated p-2 size-8 flex items-center justify-center">
                        <Icon name="material-symbols:more-vert" size="24" />
                    </DropdownMenuTrigger>
                    <DropdownMenuPortal>
                        <Transition name="dropdown">
                            <DropdownMenuContent class="w-52 shadow-black shadow-sm bg-elevated card p-1 rounded-md overflow-hidden mt-1">
                                <PopupEditAssesment :assesment>
                                    <CustomDropdownItem 
                                    value="Edit" 
                                    icon="material-symbols:edit-outline-rounded"
                                    :select-action="(e) => e.preventDefault()" />
                                </PopupEditAssesment>
                                <CustomDropdownItem value="Delete" icon="material-symbols:delete-outline-rounded"
                                :select-action="() => deleteAssesment(assesment)" />
                            </DropdownMenuContent>
                        </Transition>
                    </DropdownMenuPortal>
                </DropdownMenuRoot>
            </div>
        </div>
    </div>
</template>