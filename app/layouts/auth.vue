<template>
    <div class="w-full min-h-screen flex items-center justify-center">
        <div class="fixed top-0 left-0 p-4">
            <AppLogoLink />
        </div>
        <div class="card w-full md:w-md p-4 mx-2 flex flex-col gap-2">
            <slot />
        </div>
    </div>
</template>