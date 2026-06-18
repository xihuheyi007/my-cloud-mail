<template>
  <el-scrollbar class="scroll">
    <div>
      <div class="title" >
        <Icon icon="mdi:email-outline" width="24" height="24" />
        <div>{{settingStore.settings.title}}</div>
      </div>
      <el-menu :collapse="false" v-model:active="activeMenu" text-color="#fff" active-text-color="#fff"
               style="margin-top: 10px" @select="handleSelect">
        <el-menu-item index="email"
                      :class="route.meta.name === 'email' ? 'choose-item' : ''">
          <Icon icon="hugeicons:mailbox-01" width="20" height="20" />
          <span class="menu-name" style="margin-left: 21px">{{$t('inbox')}}</span>
        </el-menu-item>
        <el-menu-item index="send" v-if="hasPerm('email:send')"
                      :class="route.meta.name === 'send' ? 'choose-item' : ''">
          <Icon icon="cil:send" width="20" height="20" />
          <span class="menu-name" style="margin-left: 21px">{{$t('sent')}}</span>
        </el-menu-item>
        <el-menu-item index="draft" v-if="hasPerm('email:send')"
                      :class="route.meta.name === 'draft' ? 'choose-item' : ''">
          <Icon icon="ep:document" width="19" height="19" />
          <span class="menu-name" style="margin-left: 22px">{{$t('drafts')}}</span>
        </el-menu-item>
        <el-menu-item index="star"
                      :class="route.meta.name === 'star' ? 'choose-item' : ''">
          <Icon icon="solar:star-line-duotone" width="20" height="20" />
          <span class="menu-name" style="margin-left: 21px">{{$t('starred')}}</span>
        </el-menu-item>
        <el-menu-item index="setting"
                      :class="route.meta.name === 'setting' ? 'choose-item' : ''">
          <Icon icon="fluent:settings-48-regular" width="20" height="20" />
          <span class="menu-name" style="margin-left: 21px">{{$t('settings')}}</span>
        </el-menu-item>
        <template v-if="hasManagePerm">
          <div class="manage-title">
            <div>{{$t('manage')}}</div>
          </div>
          <el-menu-item index="analysis" v-if="hasPerm('analysis:query')"
                        :class="route.meta.name === 'analysis' ? 'choose-item' : ''">
            <Icon icon="fluent:data-pie-20-regular" width="24" height="24" />
            <span class="menu-name" style="margin-left: 18px">{{$t('analytics')}}</span>
          </el-menu-item>
          <el-menu-item index="user" v-if="hasPerm('user:query')"
                        :class="route.meta.name === 'user' ? 'choose-item' : ''">
            <Icon icon="si:user-alt-2-line" width="20" height="20" />
            <span class="menu-name" style="margin-left: 21px">{{$t('allUsers')}}</span>
          </el-menu-item>
          <el-menu-item index="all-email" v-if="hasPerm('all-email:query')"
                        :class="route.meta.name === 'all-email' ? 'choose-item' : ''">
            <Icon icon="fluent:mail-list-28-regular" width="22" height="22" />
            <span class="menu-name" style="margin-left: 20px">{{$t('allMail')}}</span>
          </el-menu-item>
          <el-menu-item index="role" v-if="hasPerm('role:query')"
                        :class="route.meta.name === 'role' ? 'choose-item' : ''">
            <Icon icon="fluent:lock-closed-16-regular" width="22" height="22" />
            <span class="menu-name" style="margin-left: 20px">{{$t('permissions')}}</span>
          </el-menu-item>
          <el-menu-item index="reg-key" v-if="hasPerm('reg-key:query')"
                        :class="route.meta.name === 'reg-key' ? 'choose-item' : ''">
            <Icon icon="fluent:fingerprint-20-filled" width="22" height="22" />
            <span class="menu-name" style="margin-left: 20px">{{$t('inviteCode')}}</span>
          </el-menu-item>
          <el-menu-item index="sys-setting" v-if="hasPerm('setting:query')"
                        :class="route.meta.name === 'sys-setting' ? 'choose-item' : ''">
            <Icon icon="eos-icons:system-ok-outlined" width="18" height="18" style="margin-left: 2px" />
            <span class="menu-name" style="margin-left: 22px">{{$t('SystemSettings')}}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
  </el-scrollbar>
</template>

<script setup>
import router from "@/router/index.js";
import { useRoute } from "vue-router";
import {Icon} from "@iconify/vue";
import {useSettingStore} from "@/store/setting.js";
import {useUiStore} from "@/store/ui.js";
import {hasPerm} from "@/perm/perm.js";
import {computed} from "vue";

const settingStore = useSettingStore();
const uiStore = useUiStore();
const route = useRoute();

const managePerms = ['all-email:query', 'user:query', 'role:query', 'setting:query', 'analysis:query', 'reg-key:query']
const hasManagePerm = computed(() => managePerms.some(key => hasPerm(key)))

const activeMenu = computed(() => route.meta.name)

function handleSelect(index) {
  router.push({name: index})
  if (window.innerWidth < 1025) {
    uiStore.asideShow = false
  }
}

</script>

<style lang="scss" scoped>

.title {
  margin: 15px 10px;
  height: 45px;
  border-radius: 6px;
  display: flex;
  position: relative;
  font-size: 16px;
  font-weight: bold;
  align-items: center;
  justify-content: center;
  gap: 5px;
  color: #ffffff;
  background: linear-gradient(135deg, #1890ff, #3a80dd);
  transition: all 0.3s ease;
  max-width: 240px;
  padding: 0 10px;
  > div {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: calc(240px - 20px - 30px);
  }

  :deep(.el-icon) {
    flex-shrink: 0;
    font-size: 20px;
  }

  .user-right-icon {
    align-self: center;
    position: absolute;
    font-size: 12px;
    right: 8px;
    color: #ffffff;
  }

}


.manage-title {
  margin-top: 10px;
  padding-left: 20px;
  color: #fff;
}

.el-menu-item {
  margin: 5px 10px !important;
  border-radius: 6px;
  height: 36px;
  padding: 10px !important;
}

.choose-item {
  font-weight: bold;
  background: rgba(255, 255, 255, 0.08) !important;
  backdrop-filter: blur(4px);
}

@media (hover: hover) {
  .el-menu-item:hover {
    background: rgba(255, 255, 255, 0.08) !important;
  }
}

.menu-name {
  user-select: none;
}


:deep(.el-scrollbar__wrap--hidden-default ) {
  background: var(--aside-background) !important;
}

:deep(.el-menu-item) {
  background: var(--aside-background);
}

:deep(.el-menu) {
  background: var(--aside-background);
}

.el-menu {
  border-right: 0;
  width: 260px;
}

:deep(.el-divider__text) {
  background: var(--aside-backgound);
  color: #FFFFFF;
}

.scroll {

}
</style>
