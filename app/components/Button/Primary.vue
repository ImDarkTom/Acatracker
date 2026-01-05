<template>
    <button class="
        text-text-primary bg-brand-muted flex flex-row gap-2 items-center p-2 rounded-md font-medium
        not-disabled:hover:bg-brand-base not-disabled:cursor-pointer
        disabled:opacity-50
        active:bg-brand-active!
        transition-all duration-75">
        <slot />
    </button>
</template>
