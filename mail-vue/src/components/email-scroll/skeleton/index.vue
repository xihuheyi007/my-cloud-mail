<template>
  <div v-for="item in rows" style="background: var(--el-bg-color)">
    <EmailRow
      :type="type"
      :show-star="showStar"
      :account-show="accountShow"
      :show-user-info="showUserInfo"
      right-class="email-right-skeleton"
    >
      <template #checkbox>
        <el-checkbox disabled :class="type === 'all-email' ? 'all-email-checkbox' : 'checkbox'"
        ></el-checkbox>
      </template>
      <template #star>
        <Icon style="color: var(--el-border-color)" icon="solar:star-line-duotone" width="18" height="18"/>
      </template>
      <div class="email-sender">
        <div class="email-status" v-if="showStatus">
        </div>
        <div v-else></div>
        <span class="name">
           <span>
             <el-skeleton animated>
               <template #template>
                 <el-skeleton-item variant="text" class="name-skeleton"/>
               </template>
             </el-skeleton>
           </span>
           <span></span>
        </span>
        <span class="phone-time">
          <el-skeleton animated>
            <template #template>
              <el-skeleton-item variant="text" style="width: 50px;height: 1rem;"/>
            </template>
          </el-skeleton>
        </span>
      </div>
      <div>
        <div class="email-text-skeleton">
          <el-skeleton animated>
            <template #template>
              <el-skeleton-item variant="text" class="text-skeleton-one"/>
              <el-skeleton-item variant="text" class="text-skeleton-two"/>
            </template>
          </el-skeleton>
        </div>
        <div class="user-info" v-if="showUserInfo">
          <div class="user">
            <el-skeleton animated>
              <template #template>
                <el-skeleton-item variant="text"
                                  style="width: 180px;margin-right: 5px;height: 1rem;margin-bottom: 4px;"/>
              </template>
            </el-skeleton>
          </div>
          <div class="account">
            <el-skeleton animated>
              <template #template>
                <el-skeleton-item variant="text"
                                  style="width: 180px;margin-right: 5px;height: 1rem;margin-bottom: 4px;"/>
              </template>
            </el-skeleton>
          </div>
          <div class="del-status" v-if="item.isDel">
            <el-tag type="danger" size="small">{{ $t('deleted') }}</el-tag>
          </div>
        </div>
      </div>
      <template #right>
        <el-skeleton animated>
          <template #template>
            <el-skeleton-item variant="text" style="width: 60px;margin-right: 15px;height: 1rem;"/>
          </template>
        </el-skeleton>
      </template>
    </EmailRow>
  </div>
</template>
<script setup>
import EmailRow from '@/components/email-scroll/EmailRow.vue'
const props = defineProps({
  rows: {
    type: Number,
    default: 1
  },
  showStar: {
    type: Boolean,
    default: true
  },
  accountShow: {
    type: Boolean,
    default: false
  },
  showStatus: {
    type: Boolean,
    default: false
  },
  showUserInfo: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: ''
  }
})
import {Icon} from "@iconify/vue";
</script>

<style scoped lang="scss">

:deep(.el-skeleton__item) {
  position: relative;
  top: 2px;
}

</style>
