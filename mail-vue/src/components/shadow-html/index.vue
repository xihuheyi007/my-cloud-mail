<template>
  <div class="content-box" ref="contentBox">
    <div ref="container" class="content-html"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import DOMPurify from 'dompurify'

const props = defineProps({
  html: {
    type: String,
    required: true
  }
})

const container = ref(null)
const contentBox = ref(null)
let shadowRoot = null

function isDark() {
  return document.documentElement.classList.contains('dark')
}

function updateContent() {
  if (!shadowRoot) return;

  // 1. 提取 <body> 的 style 属性（如果存在）
  const bodyStyleRegex = /<body[^>]*style="([^"]*)"[^>]*>/i;
  const bodyStyleMatch = props.html.match(bodyStyleRegex);
  const bodyStyle = bodyStyleMatch ? bodyStyleMatch[1] : '';

  // 2. 移除 <body> 标签（保留内容）
  const cleanedHtml = props.html.replace(/<\/?body[^>]*>/gi, '');

  const dark = isDark()
  const textColor = dark ? '#D4D4D4' : '#13181D'
  const bgColor = dark ? '#1E1E1E' : '#FFFFFF'
  const linkColor = dark ? '#6CB2F0' : '#0E70DF'
  const secondaryColor = dark ? '#A0A0A0' : '#666666'

  // 3. 将 body 的 style 应用到 .shadow-content
  shadowRoot.innerHTML = `
    <style>
      :host {
        all: initial;
        width: 100%;
        height: 100%;
        font-family: -apple-system, Inter, BlinkMacSystemFont,
                    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        font-size: 14px;
        line-height: 1.5;
        color: ${textColor};
        word-break: break-word;
      }

      h1, h2, h3, h4 {
          font-size: 18px;
          font-weight: 700;
          color: ${textColor};
      }

      p {
        margin: 0;
        color: ${textColor};
      }

      span, div, td, th, li, label, em, strong, b, i, u, s, del, ins, mark, small, big, sub, sup {
        color: inherit;
      }

      a {
        text-decoration: none;
        color: ${linkColor};
      }

      .shadow-content {
        background: ${bgColor};
        color: ${textColor};
        width: fit-content;
        height: fit-content;
        min-width: 100%;
        ${bodyStyle ? bodyStyle : ''}
      }

      img:not(table img) {
        max-width: 100%;
        height: auto !important;
      }

      /* 深色模式下图片不过曝 */
      ${dark ? `
      img {
        opacity: 0.92;
      }
      ` : ''}

    </style>
    <div class="shadow-content">
      ${DOMPurify.sanitize(cleanedHtml, {
        ALLOWED_TAGS: ['p','br','b','i','u','strong','em','a','img','table','tr','td','th','thead','tbody','div','span','ul','ol','li','h1','h2','h3','h4','h5','h6','blockquote','pre','code','hr','section','article','header','footer','figure','figcaption'],
        ALLOWED_ATTR: ['href','src','alt','width','height','style','class','id','title','target','rel','colspan','rowspan','align','valign','bgcolor','color','face','size','dir','lang'],
      })}
    </div>
  `;
}

function autoScale() {
  if (!shadowRoot || !contentBox.value) return

  const parent = contentBox.value
  const shadowContent = shadowRoot.querySelector('.shadow-content')

  if (!shadowContent) return

  const parentWidth = parent.offsetWidth
  const childWidth = shadowContent.scrollWidth

  if (childWidth === 0) return

  const scale = parentWidth / childWidth

  const contentEl = shadowRoot.querySelector('.shadow-content')
  if (contentEl) {
    contentEl.style.transform = `scale(${scale})`
    contentEl.style.transformOrigin = 'top left'
    contentEl.style.width = `${100 / scale}%`
  }
}

onMounted(() => {
  shadowRoot = container.value.attachShadow({ mode: 'open' })
  updateContent()
  autoScale()

  // 监听主题切换，重新渲染 shadow DOM 样式
  const observer = new MutationObserver(() => {
    updateContent()
    autoScale()
  })
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  })
})

watch(() => props.html, () => {
  updateContent()
  autoScale()
})
</script>

<style scoped>
.content-box {
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-family: -apple-system, Inter, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
}

.content-html {
  width: 100%;
  height: 100%;
}
</style>
