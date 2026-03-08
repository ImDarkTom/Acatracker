const VIEW_CONFIG = {
    '/dashboard': 'Back home',
    '/dashboard/calendar': 'Back to calendar',
    '/dashboard/timeline': 'Back to timeline',
} as const;

type ViewPath = keyof typeof VIEW_CONFIG;

type ViewMetadata = {
    path: ViewPath,
    backText: typeof VIEW_CONFIG[ViewPath],
};

export const useUiStore = defineStore('useUiStore', () => {
    const lastOpenedView = ref<ViewMetadata>({
        backText: 'Back home',
        path: '/dashboard',
    });
    const sidebarCollapsed = ref(false);

    function setLastOpenedView(path: ViewPath) {
        lastOpenedView.value = {
            path,
            backText: VIEW_CONFIG[path],
        };
    }

    function collapseSidebar() {
        sidebarCollapsed.value = !sidebarCollapsed.value;
    }

    return {
        lastOpenedView,
        setLastOpenedView,
        sidebarCollapsed,
        collapseSidebar,
    }
});