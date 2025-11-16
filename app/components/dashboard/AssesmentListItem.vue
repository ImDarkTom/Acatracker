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
            <div class="text-text-secondary flex flex-row gap-2 items-center">
                <code class="ring-1 ring-text-secondary text-sm p-0.5 rounded-sm h-min">{{ module.code }}</code>
                <span class="text-lg">{{ module.name }}</span>
            </div>

            <DropdownMenuRoot>
                <DropdownMenuTrigger
                    class="rounded-sm data-[state='open']:bg-base hover:bg-elevated cursor-pointer p-2 size-8 flex items-center justify-center">
                    <Icon name="material-symbols:more-vert" size="24" />
                </DropdownMenuTrigger>
                <DropdownMenuPortal>
                    <DropdownMenuContent class="w-52 shadow-base shadow-sm bg-elevated rounded-md overflow-hidden mt-1">
                        <EditModule 
                            :module 
                            @submitted="modulesStore.refresh()">
                            <CustomDropdownItem 
                                value="Edit" 
                                icon="material-symbols:edit-outline-rounded"
                                :select-action="(e) => e.preventDefault()" />
                        </EditModule>
                        <CustomDropdownItem 
                            value="Delete" 
                            icon="material-symbols:delete-outline-rounded"
                            :select-action="() => deleteModule(module)" />
                    </DropdownMenuContent>
                </DropdownMenuPortal>
            </DropdownMenuRoot>
        </div>

        <div v-for="assesment in assesments.filter(a => a.module === module.id)" :key="assesment.id"
            class="bg-elevated p-2 rounded-sm flex flex-row">
            <div class="flex flex-col grow">
                <span class="text-lg">{{ assesment.name }}</span>
                <div class="flex flex-row w-full gap-1 text-sm">
                    <span v-if="assesment.releasedAt" class="text-text-secondary flex flex-row gap-1 items-center">
                        <Icon name="material-symbols:rocket-launch-outline-rounded" size="12" />
                        {{ new Date(assesment.releasedAt).toLocaleDateString() }}
                    </span>

                    <div class="w-full h-px my-auto border-b-2 border-dotted border-text-secondary"></div>

                    <span class="text-text-secondary flex flex-row gap-1 items-center">
                        <Icon name="material-symbols:nest-clock-farsight-analog-outline-rounded" size="12" />
                        {{ new Date(assesment.dueAt).toLocaleDateString() }}
                    </span>
                </div>
            </div>
            <div class="flex flex-col gap-2 items-center pl-2">
                <DropdownMenuRoot>
                    <DropdownMenuTrigger
                        class="rounded-sm data-[state='open']:bg-base p-2 size-8 flex items-center justify-center">
                        <Icon name="material-symbols:more-vert" size="24" />
                    </DropdownMenuTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuContent class="w-52 shadow-base shadow-sm bg-elevated rounded-md overflow-hidden mt-1">
                            <EditAssesment :assesment @submitted="assesmentsStore.refresh()">
                                <CustomDropdownItem value="Edit" icon="material-symbols:edit-outline-rounded"
                                    :select-action="(e) => e.preventDefault()" />
                            </EditAssesment>
                            <CustomDropdownItem value="Delete" icon="material-symbols:delete-outline-rounded"
                                :select-action="() => deleteAssesment(assesment)" />
                        </DropdownMenuContent>
                    </DropdownMenuPortal>
                </DropdownMenuRoot>
            </div>
        </div>
    </div>
</template>