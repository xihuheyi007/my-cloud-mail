<template>
  <div :class="'email-row ' + type" v-bind="$attrs">
    <slot name="checkbox" />
    <div class="pc-star" v-if="showStar">
      <slot name="star" />
    </div>
    <div v-if="!showStar"></div>
    <div class="title" :class="accountShow ? 'title-column' : 'title-column'">
      <slot />
    </div>
    <div :class="rightClass" :style="showUserInfo ? 'align-self: start;' : ''">
      <slot name="right" />
    </div>
  </div>
</template>

<script setup>
defineOptions({ inheritAttrs: false })

defineProps({
  type: {
    type: String,
    default: 'email'
  },
  showStar: {
    type: Boolean,
    default: true
  },
  accountShow: {
    type: Boolean,
    default: false
  },
  showUserInfo: {
    type: Boolean,
    default: false
  },
  rightClass: {
    type: String,
    default: 'email-right'
  }
})
</script>

<style lang="scss" scoped>
.email-row {
  display: flex;
  padding: 8px 0;
  justify-content: space-between;
  box-shadow: var(--header-actions-border);
  cursor: pointer;
  align-items: center;
  position: relative;
  transition: background 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  height: 48px;
  @media (max-width: 768px) {
    height: 83px;
  }

  @media (pointer: coarse) {
    user-select: none;
  }
  &.all-email {
    height: 65px;
    @media (max-width: 768px) {
      height: 132px;
    }
  }

  .title {
    flex: 1;
    display: grid;
    grid-template-columns: 240px 1fr;
    @media (max-width: 768px) {
      padding-right: 15px;
    }
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 4px;
    }
  }

  .title-column {
    @media (max-width: 768px) {
      grid-template-columns: 1fr !important;
      gap: 4px !important;
    }
  }

  .email-right {
    text-align: right;
    font-size: 12px;
    white-space: nowrap;
    display: flex;
    padding-left: 15px;
    align-items: center;
    @media (max-width: 768px) {
      display: none;
    }
  }

  .email-right-skeleton {
    @media (max-width: 768px) {
      display: none;
    }
  }

  &:hover {
    background-color: var(--email-hover-background);
    z-index: 0;
  }
}

.pc-star {
  display: flex;
  width: 40px;
}

@media (max-width: 768px) {
  .pc-star {
    display: none;
  }
  .phone-star {
    display: block;
    align-self: end;
    padding-right: 16px;
    padding-top: 8px;
  }
  .star-pd {
    padding-top: 6px !important;
  }
}
</style>
