<template>
    <nav class="bg-base flex items-center flex-row justify-between p-4 sticky top-0 left-0 z-90">
        <ul class="flex flex-row gap-4">
            <li class="mr-2 text-brand-400 font-bold select-none hidden md:block">
                Acatracker
            </li>
            <NavbarItem 
                to="/dashboard/assessments" 
                iconName="material-symbols:task-alt-rounded"
                text="Assessments" />
            <NavbarItem
                class="md:hidden"
                to="/dashboard/calendar" 
                iconName="material-symbols:calendar-month-outline-rounded"
                text="Calendar" />
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