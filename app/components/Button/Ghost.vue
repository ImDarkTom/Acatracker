<template>
    <button class="
        flex flex-row gap-1 items-center rounded-md p-2 font-medium
        not-disabled:hover:bg-bg-active not-disabled:cursor-pointer
        not-disabled:active:bg-bg-focus!
        disabled:opacity-50
        transition-all duration-75">
        <slot />
    </button>
</template>