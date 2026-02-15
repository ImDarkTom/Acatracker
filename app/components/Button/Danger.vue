<template>
    <button class="
        text-danger-text bg-danger-bg flex flex-row gap-2 items-center p-2 rounded-md font-medium
        not-disabled:hover:bg-danger-bg-hover not-disabled:cursor-pointer
        disabled:opacity-50
        active:bg-danger-bg-active!
        transition-all duration-75">
        <slot />
    </button>
</template>
