<template>
  <div class="content-box" ref="contentBox">
    <div ref="container" class="content-html"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

const props = defineProps({
  html: {
    type: String,
    required: true
  },
  dark: {
    type: Boolean,
    default: false
  }
})

const container = ref(null)
const contentBox = ref(null)
let shadowRoot = null

function updateContent() {
  if (!shadowRoot) return

  const bgColor = props.dark ? '#1a1a1a' : '#FFFFFF'
  const textColor = props.dark ? '#e0e0e0' : '#13181D'
  const linkColor = props.dark ? '#6db3f2' : '#0E70DF'

  const bodyStyleRegex = /<body[^>]*style="([^"]*)"[^>]*>/i;
  const bodyStyleMatch = props.html.match(bodyStyleRegex);
  const bodyStyle = bodyStyleMatch ? bodyStyleMatch[1] : '';

  const cleanedHtml = props.html.replace(/<\/?body[^>]*>/gi, '');

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
      }

      p {
        margin: 0;
      }

      a {
        text-decoration: none;
        color: ${linkColor};
      }

      .shadow-content {
        background: ${bgColor};
        width: fit-content;
        height: fit-content;
        min-width: 100%;
        ${bodyStyle ? bodyStyle : ''}
      }

      img:not(table img) {
        max-width: 100%;
        height: auto !important;
      }

    </style>
    <div class="shadow-content">
      ${cleanedHtml}
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

  const hostElement = shadowRoot.host
  hostElement.style.zoom = scale
}

onMounted(() => {
  shadowRoot = container.value.attachShadow({ mode: 'open' })
  updateContent()
  autoScale()
})

watch(() => props.html, () => {
  updateContent()
  autoScale()
})

watch(() => props.dark, () => {
  updateContent()
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