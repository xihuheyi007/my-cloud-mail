<template>
  <el-container class="layout">
    <el-aside
        class="aside"
        :class="asideClass"
        :style="{ width: asideWidth }">
      <Aside />
    </el-aside>
    <div
        v-if="isMobile && uiStore.asideShow"
        class="overlay-show"
        @click="uiStore.asideShow = false"
    ></div>
    <el-container class="main-container">
      <el-main>
        <el-header>
            <Header />
        </el-header>
        <Main />
      </el-main>
    </el-container>
  </el-container>
  <writer ref="writerRef" />
</template>

<script setup>
import Aside from '@/layout/aside/index.vue'
import Header from '@/layout/header/index.vue'
import Main from '@/layout/main/index.vue'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import {useUiStore} from "@/store/ui.js";
import writer from '@/layout/write/index.vue'

const uiStore = useUiStore();
const writerRef = ref({})
const isMobile = ref(window.innerWidth < 1025)

const asideWidth = computed(() => {
    if (isMobile.value) return '260px'
    return uiStore.asideCollapsed ? '60px' : '260px'
})

const asideClass = computed(() => {
    if (isMobile.value) {
        return uiStore.asideShow ? 'aside-drawer-open' : 'aside-drawer-hide'
    }
    return uiStore.asideCollapsed ? 'aside-collapsed' : 'aside-expanded'
})

const handleResize = () => {
    const wasMobile = isMobile.value
    isMobile.value = window.innerWidth < 1025

    if (wasMobile && !isMobile.value) {
        uiStore.asideShow = false
    }
}

onMounted(() => {
    uiStore.writerRef = writerRef
    window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', handleResize)
})
</script>

<style lang="scss" scoped>
.layout {
  height: 100%;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
}

.el-aside {
  transition: width 200ms ease, transform 200ms ease;
  overflow-x: hidden;
}

.aside-collapsed {
  width: 60px;
}

.aside-expanded {
  width: 260px;
  box-shadow: var(--aside-right-border);
}

.aside-drawer-open {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 260px;
  z-index: 101;
  transform: translateX(0);
  transition: transform 200ms ease;
  box-shadow: var(--aside-right-border);
}

.aside-drawer-hide {
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 260px;
  z-index: 101;
  transform: translateX(-100%);
  transition: transform 200ms ease;
}

.main-container {
  min-height: 100%;
  background: var(--el-bg-color);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.el-main {
  padding: 0;
}

.el-header {
  background: var(--el-bg-color);
  border-bottom: solid 1px var(--el-border-color);
  padding: 0;
}

.overlay-show {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  z-index: 99;
  transition: opacity 0.3s;
}
</style>