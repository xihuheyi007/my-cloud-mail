import { defineStore } from 'pinia'

export const useUiStore = defineStore('ui', {
    state: () => ({
        asideShow: window.innerWidth > 1024,
        asideCollapsed: true,
        accountShow: false,
        backgroundLoading: true,
        changeNotice: 0,
        writerRef: null,
        changePreview: 0,
        previewData: {},
        key: 0,
        themeMode: 'system',
        systemPrefersDark: window.matchMedia('(prefers-color-scheme: dark)').matches,
        asideCount: {
            email: 0,
            send: 0,
            sysEmail: 0
        }
    }),
    getters: {
        isDark: (state) => {
            if (state.themeMode === 'system') {
                return state.systemPrefersDark
            }
            return state.themeMode === 'dark'
        }
    },
    actions: {
        showNotice() {
            this.changeNotice++
        },
        previewNotice(data) {
            this.previewData = data
            this.changePreview++
        },
        setThemeMode(mode) {
            this.themeMode = mode
        },
        updateSystemTheme(isDark) {
            this.systemPrefersDark = isDark
        },
        toggleAside() {
            this.asideShow = !this.asideShow
        }
    },
    persist: {
        pick: ['accountShow', 'themeMode', 'asideCollapsed'],
    },
})