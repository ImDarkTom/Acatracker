<template>
    <button class="
        ring-1 ring-inset ring-highlight flex flex-row gap-1 items-center rounded-md p-2 pr-3 font-medium
        not-disabled:cursor-pointer not-disabled:hover:bg-highlight
        active:bg-bg-focus!
        disabled:opacity-50
        transition-all duration-75">
        <slot />
    </button>
</template>