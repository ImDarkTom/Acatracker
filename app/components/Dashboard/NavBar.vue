<template>
    <nav class="flex flex-row items-center justify-between p-2 z-90">
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