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

        const metaTag = document.getElementById('theme-color-meta')
        if (metaTag) {
            const isMobile = !window.matchMedia('(pointer: fine) and (hover: hover)').matches
            metaTag.setAttribute('content', isDark
                ? (isMobile ? '#141414' : '#000000')
                : (isMobile ? '#FFFFFF' : '#F1F1F1'))
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