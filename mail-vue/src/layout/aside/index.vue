<template>
  <el-scrollbar class="scroll">
    <div>
      <div class="title" :class="{ 'title-collapsed': collapsed }">
        <Icon icon="mdi:email-outline" width="24" height="24" />
        <div v-show="!collapsed">{{ settingStore.settings.title }}</div>
      </div>
      <el-menu
          :collapse="collapsed"
          :background-color="menuBgColor"
          :text-color="menuTextColor"
          :active-text-color="activeTextColor"
          style="margin-top: 10px; border-right: none;">
        <el-menu-item @click="router.push({name: 'email'})" index="email"
                      :class="route.meta.name === 'email' ? 'choose-item' : ''">
          <Icon icon="hugeicons:mailbox-01" width="20" height="20" />
          <template #title>
            <span class="menu-name">{{ $t('inbox') }}</span>
          </template>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'send'})" index="send" v-perm="'email:send'"
                      :class="route.meta.name === 'send' ? 'choose-item' : ''">
          <Icon icon="cil:send" width="20" height="20" />
          <template #title>
            <span class="menu-name">{{ $t('sent') }}</span>
          </template>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'draft'})" index="draft" v-perm="'email:send'"
                      :class="route.meta.name === 'draft' ? 'choose-item' : ''">
          <Icon icon="ep:document" width="19" height="19" />
          <template #title>
            <span class="menu-name">{{ $t('drafts') }}</span>
          </template>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'star'})" index="star"
                      :class="route.meta.name === 'star' ? 'choose-item' : ''">
          <Icon icon="solar:star-line-duotone" width="20" height="20" />
          <template #title>
            <span class="menu-name">{{ $t('starred') }}</span>
          </template>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'setting'})" index="setting"
                      :class="route.meta.name === 'setting' ? 'choose-item' : ''">
          <Icon icon="fluent:settings-48-regular" width="20" height="20" />
          <template #title>
            <span class="menu-name">{{ $t('settings') }}</span>
          </template>
        </el-menu-item>
        <div class="manage-title" v-perm="['all-email:query','user:query','role:query','setting:query','analysis:query','reg-key:query']">
          <div>{{ $t('manage') }}</div>
        </div>
        <el-menu-item @click="router.push({name: 'analysis'})" index="analysis" v-perm="'analysis:query'"
                      :class="route.meta.name === 'analysis' ? 'choose-item' : ''">
          <Icon icon="fluent:data-pie-20-regular" width="24" height="24" />
          <template #title>
            <span class="menu-name">{{ $t('analytics') }}</span>
          </template>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'user'})" index="user" v-perm="'user:query'"
                      :class="route.meta.name === 'user' ? 'choose-item' : ''">
          <Icon icon="si:user-alt-2-line" width="20" height="20" />
          <template #title>
            <span class="menu-name">{{ $t('allUsers') }}</span>
          </template>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'all-email'})" index="all-email" v-perm="'all-email:query'"
                      :class="route.meta.name === 'all-email' ? 'choose-item' : ''">
          <Icon icon="fluent:mail-list-28-regular" width="22" height="22" />
          <template #title>
            <span class="menu-name">{{ $t('allMail') }}</span>
          </template>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'role'})" index="role" v-perm="'role:query'"
                      :class="route.meta.name === 'role' ? 'choose-item' : ''">
          <Icon icon="fluent:lock-closed-16-regular" width="22" height="22" />
          <template #title>
            <span class="menu-name">{{ $t('permissions') }}</span>
          </template>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'reg-key'})" index="reg-key" v-perm="'reg-key:query'"
                      :class="route.meta.name === 'reg-key' ? 'choose-item' : ''">
          <Icon icon="fluent:fingerprint-20-filled" width="22" height="22" />
          <template #title>
            <span class="menu-name">{{ $t('inviteCode') }}</span>
          </template>
        </el-menu-item>
        <el-menu-item @click="router.push({name: 'sys-setting'})" index="sys-setting" v-perm="'setting:query'"
                      :class="route.meta.name === 'sys-setting' ? 'choose-item' : ''">
          <Icon icon="eos-icons:system-ok-outlined" width="18" height="18" style="margin-left: 2px" />
          <template #title>
            <span class="menu-name">{{ $t('SystemSettings') }}</span>
          </template>
        </el-menu-item>
      </el-menu>
    </div>
  </el-scrollbar>
</template>

<script setup>
import { computed } from 'vue'
import router from "@/router/index.js"
import { useRoute } from "vue-router"
import { Icon } from "@iconify/vue"
import { useSettingStore } from "@/store/setting.js"
import { useUiStore } from "@/store/ui.js"

const settingStore = useSettingStore()
const route = useRoute()
const uiStore = useUiStore()

const collapsed = computed(() => uiStore.asideCollapsed)

const menuBgColor = computed(() => 'var(--aside-background)')
const menuTextColor = computed(() => 'var(--aside-menu-text)')
const activeTextColor = computed(() => 'var(--aside-active-text)')
</script>

<style lang="scss" scoped>
.title {
  margin: 15px 10px;
  height: 45px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--aside-title-text);
  background: var(--aside-title-bg);
  transition: all 0.3s ease;
  max-width: 240px;
  padding: 0 12px;
  overflow: hidden;

  &.title-collapsed {
    max-width: 40px;
    padding: 0;
    margin: 15px auto;
  }

  > div {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-weight: bold;
    font-size: 16px;
  }

  :deep(.el-icon) {
    flex-shrink: 0;
    font-size: 20px;
  }
}

.manage-title {
  margin-top: 10px;
  padding-left: 20px;
  color: var(--aside-menu-text);
  font-size: 12px;
  opacity: 0.7;
  transition: opacity 0.2s;

  .title-collapsed + & {
    display: none;
  }
}

:deep(.el-menu-item) {
  margin: 4px 8px;
  border-radius: 8px;
  height: 40px;
}

:deep(.el-menu--collapse) {
  width: 60px;
}

.choose-item {
  background: var(--aside-active-bg) !important;
  font-weight: bold;
}

:deep(.el-menu-item:hover) {
  background: var(--aside-hover-bg) !important;
}

.menu-name {
  user-select: none;
  margin-left: 12px;
}

:deep(.el-scrollbar__wrap--hidden-default) {
  background: var(--aside-background) !important;
}

:deep(.el-menu) {
  background: var(--aside-background);
  border-right: none;
}

.scroll {
  height: 100%;
}
</style>