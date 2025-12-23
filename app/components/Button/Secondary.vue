<template>
    <button class="
        bg-bg-active ring-1 ring-inset ring-highlight flex flex-row gap-2 items-center rounded-md p-2 font-medium
        not-disabled:cursor-pointer not-disabled:hover:bg-highlight
        active:bg-bg-focus!
        disabled:opacity-50
        transition-all duration-75">
        <slot />
    </button>
</template>