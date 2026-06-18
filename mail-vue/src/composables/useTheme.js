import { watch, onMounted, onBeforeUnmount } from 'vue'
import { useUiStore } from '@/store/ui.js'

export function useTheme() {
    const uiStore = useUiStore()
    let mediaQuery = null
    let mediaHandler = null

    const applyTheme = () => {
        const root = document.documentElement
        const isDark = uiStore.isDark

        root.classList.toggle('dark', isDark)
        root.setAttribute('data-theme', isDark ? 'dark' : 'light')

        const themeColorMeta = document.querySelector('meta[name="theme-color"]')
        if (themeColorMeta) {
            themeColorMeta.setAttribute('content', isDark ? '#1a1a1a' : '#ffffff')
        }
    }

    onMounted(() => {
        mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        uiStore.updateSystemTheme(mediaQuery.matches)

        mediaHandler = (e) => {
            uiStore.updateSystemTheme(e.matches)
        }
        mediaQuery.addEventListener('change', mediaHandler)

        applyTheme()
    })

    onBeforeUnmount(() => {
        if (mediaQuery && mediaHandler) {
            mediaQuery.removeEventListener('change', mediaHandler)
        }
    })

    watch(() => uiStore.isDark, applyTheme)

    return { applyTheme }
}