<script setup lang="ts">
const preferencesStore = useUserPreferencesStore();
const { preferences } = storeToRefs(preferencesStore);

async function setActiveYearOrSemester(newValues: { currentYear?: number, currentSemester?: number }) {
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
    <div v-else class="flex flex-row gap-2">
        <DropdownMenuRoot>
            <DropdownMenuTrigger :as-child="true">
                <ButtonSecondary class="w-1/2 flex justify-between">
                    <span>Year {{ preferences.currentYear }}</span>
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
                <ButtonSecondary class="w-1/2 flex justify-between">
                    <span>Semester {{ preferences.currentSemester }}</span>
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