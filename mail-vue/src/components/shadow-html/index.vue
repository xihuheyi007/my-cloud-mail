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

  const bgColor = props.dark ? '#121212' : '#FFFFFF'
  const textColor = props.dark ? '#E8E8E8' : '#13181D'
  const secondaryTextColor = props.dark ? '#A0A0A0' : '#585d69'
  const linkColor = props.dark ? '#64B5F6' : '#0E70DF'
  const borderColor = props.dark ? '#333333' : '#E0E0E0'

  const bodyStyleRegex = /<body[^>]*style="([^"]*)"[^>]*>/i;
  const bodyStyleMatch = props.html.match(bodyStyleRegex);
  const bodyStyle = bodyStyleMatch ? bodyStyleMatch[1] : '';

  const cleanedHtml = props.html.replace(/<\/?body[^>]*>/gi, '');

  const darkModeOverride = props.dark ? `
    [style*="color"], span[style*="color"], div[style*="color"], p[style*="color"],
    td[style*="color"], th[style*="color"], li[style*="color"], font[style*="color"] {
      color: ${textColor} !important;
    }

    [style*="background: #fff"], [style*="background: #FFF"],
    [style*="background: white"], [style*="background: #FFFFFF"],
    [style*="background-color: #fff"], [style*="background-color: #FFF"],
    [style*="background-color: white"], [style*="background-color: #FFFFFF"],
    [style*="background: rgb(255, 255, 255)"], [style*="background:rgb(255, 255, 255)"] {
      background-color: #1E1E1E !important;
    }

    [style*="color: #333"], [style*="color:#333"],
    [style*="color: #000"], [style*="color:#000"],
    [style*="color: #13181D"], [style*="color:#13181D"],
    [style*="color: rgb(0, 0, 0)"], [style*="color:rgb(0,0,0)"],
    [style*="color: black"], [style*="color:black"] {
      color: ${textColor} !important;
    }
  ` : '';

  shadowRoot.innerHTML = `
    <style>
      :host {
        all: initial;
        width: 100%;
        height: 100%;
        font-family: -apple-system, Inter, BlinkMacSystemFont,
                    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        font-size: 14px;
        line-height: 1.6;
        color: ${textColor};
        word-break: break-word;
      }

      h1, h2, h3, h4 {
          font-size: 18px;
          font-weight: 700;
          color: ${textColor};
          margin: 16px 0 8px 0;
      }

      p {
        margin: 0 0 8px 0;
        color: ${textColor};
      }

      a {
        text-decoration: none;
        color: ${linkColor};
      }

      a:hover {
        text-decoration: underline;
      }

      table {
        border-collapse: collapse;
      }

      td, th {
        border: 1px solid ${borderColor};
        padding: 8px;
      }

      blockquote {
        border-left: 3px solid ${borderColor};
        margin: 8px 0;
        padding-left: 12px;
        color: ${secondaryTextColor};
      }

      .shadow-content {
        background: ${bgColor};
        width: fit-content;
        height: fit-content;
        min-width: 100%;
        padding: 16px;
        box-sizing: border-box;
        ${bodyStyle ? bodyStyle : ''}
      }

      img:not(table img) {
        max-width: 100%;
        height: auto !important;
      }

      pre, code {
        background: ${props.dark ? '#1E1E1E' : '#F5F5F5'};
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 13px;
        overflow-x: auto;
      }

      hr {
        border: none;
        border-top: 1px solid ${borderColor};
        margin: 16px 0;
      }

      ${darkModeOverride}

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