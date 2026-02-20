<script setup lang="ts">
const preferencesStore = useUserPreferencesStore();
const { preferences } = storeToRefs(preferencesStore);

async function setActiveYearOrSemester(newValues: { currentYear?: number, currentSemester?: number }) {
    // If we are trying to set the same semester or year as the current one, do nothing
    if (
        (newValues.currentSemester && newValues.currentSemester === preferences.value?.currentSemester)
        || (newValues.currentYear && newValues.currentYear === preferences.value?.currentYear)
    ) return;

    try {
        await preferencesStore.updateUserPreferences(newValues);
    } catch (error) {
        alert("There was an error setting your semester.")
    }
}

</script>

<template>
    <div
        v-if="preferencesStore.pending" 
        class="card flex items-center justify-center">
        <LoadingIcon />
    </div>
    <div 
        v-else-if="preferencesStore.error || !preferences" 
        class="card flex items-center justify-center">
        There was an error loading preferences.
    </div>
    <div v-else class="grid grid-cols-2 gap-2">
        <DropdownMenuRoot>
            <DropdownMenuTrigger :as-child="true">
                <ButtonSecondary layer="app" class="flex justify-between">
                    <span class="line-clamp-1">Year {{ preferences.currentYear }}</span>
                    <Icon name="lucide:chevrons-up-down" />
                </ButtonSecondary>
            </DropdownMenuTrigger>
            <DropdownMenuPortal>
                <DropdownMenuContent 
                    :align="'start'"
                    :align-offset="16"
                    class="dropdown-content z-100">
                    <CustomDropdownItem
                        v-for="year in preferences.totalYears"
                        :value="`Year ${year}`"
                        @click="setActiveYearOrSemester({ currentYear: year })" />
                </DropdownMenuContent>
            </DropdownMenuPortal>
        </DropdownMenuRoot>

        <DropdownMenuRoot>
            <DropdownMenuTrigger :as-child="true">
                <ButtonSecondary layer="app" class="flex justify-between">
                    <span class="line-clamp-1">Semester {{ preferences.currentSemester }}</span>
                    <Icon name="lucide:chevrons-up-down" />
                </ButtonSecondary>
            </DropdownMenuTrigger>
            <DropdownMenuPortal>
                <DropdownMenuContent 
                    :align="'start'"
                    :align-offset="16"
                    class="dropdown-content z-100">
                    <CustomDropdownItem
                        v-for="semester in preferences.semestersPerYear"
                        :value="`Semester ${semester}`"
                        @click="setActiveYearOrSemester({ currentSemester: semester })" />
                </DropdownMenuContent>
            </DropdownMenuPortal>
        </DropdownMenuRoot>
    </div>
</template>