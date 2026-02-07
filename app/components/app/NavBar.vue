<template>
    <nav class="bg-bg-base ring-1 ring-highlight flex flex-row items-center justify-between p-4 min-h-18 sticky top-0 left-0 z-90">
        <ul class="flex flex-row gap-4">
            <li class="mr-2">
                <AppLogoLink />
            </li>
        </ul>
        <ul class="flex flex-row gap-2">
            <li class="flex items-center mr-2">
                <AppThemeToggle />
            </li>
            <li class="flex items-center">
                <AuthButton />
            </li>
        </ul>
    </nav>
</template>