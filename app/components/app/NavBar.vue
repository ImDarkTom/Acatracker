<script setup lang="ts">
import { RouterLink } from 'vue-router';

</script>

<template>
    <nav class="bg-base flex items-center flex-row justify-between p-4">
        <ul class="flex flex-row gap-2">
            <li class="mr-2 text-brand-400 font-bold select-none hidden md:block">
                Acatracker
            </li>
            <NavbarItem 
                to="/dashboard" 
                iconName="material-symbols:task-alt-rounded" />
            <NavbarItem 
                to="/dashboard/calendar" 
                iconName="material-symbols:calendar-month-outline-rounded" />
        </ul>
        <ul class="flex flex-row gap-2">
            <li class="flex items-center mr-2">
                <AppThemeToggle />
            </li>
            <li>
                <AuthButton />
            </li>
        </ul>
    </nav>
</template>