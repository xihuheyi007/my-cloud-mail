<p align="center">
    <img src="doc/demo/logo.png" width="80px" />
    <h1 align="center">Cloud Mail</h1>
    <p align="center">A simple, responsive email service designed to run on Cloudflare Workers 🎉</p>
    <p align="center">
       <a href="/README.md" style="margin-left: 5px">简体中文</a> | English
    </p>
    <p align="center">
        <a href="https://github.com/maillab/cloud-mail/tree/main?tab=MIT-1-ov-file" target="_blank" >
            <img src="https://img.shields.io/badge/license-MIT-green" />
        </a>
        <a href="https://github.com/maillab/cloud-mail/releases" target="_blank" >
            <img src="https://img.shields.io/github/v/release/maillab/cloud-mail" alt="releases" />
        </a>
        <a href="https://github.com/maillab/cloud-mail/issues" >
            <img src="https://img.shields.io/github/issues/maillab/cloud-mail" alt="issues" />
        </a>
        <a href="https://github.com/maillab/cloud-mail/stargazers" target="_blank">
            <img src="https://img.shields.io/github/stars/maillab/cloud-mail" alt="stargazers" />
        </a>
        <a href="https://github.com/maillab/cloud-mail/forks" target="_blank" >
            <img src="https://img.shields.io/github/forks/maillab/cloud-mail" alt="forks" />
        </a>
    </p>
    <p align="center">
        <a href="https://trendshift.io/repositories/14418" target="_blank" >
            <img src="https://trendshift.io/api/badge/repositories/14418" alt="trendshift" >
        </a>
    </p>
</p>

> ⚠️ **This project is a modified version of [maillab/cloud-mail](https://github.com/maillab/cloud-mail), inheriting all its features.**

---

## Modification Notes

This project includes the following UI improvements:

### 🌗 Theme Mode Upgrade

- **Three theme modes**: Light / Dark / System
- **Auto-switch**: Listen to system theme preferences and respond in real-time
- **Persistent storage**: User's theme preference is automatically saved

### 📂 Sidebar Optimization

- **Collapsed by default**: Sidebar collapses to icon mode (60px width)
- **Expand on demand**: Click hamburger button to expand full menu
- **Color adaptation**: Light background in light mode, dark background in dark mode
- **Smooth animations**: Smooth transition animations for collapse/expand

### 🎨 Modern UI Design

- **Card layout**: Email list uses modern card design with rounded corners and shadows
- **Hover effects**: Subtle shadow lift effect on card hover
- **Unified colors**: All using CSS variables for easy theme switching

### 🔧 Technical Improvements

- **State management refactored**: Separated desktop collapse state from mobile drawer state
- **Theme Composable**: New `useTheme.js` for unified theme management
- **Code maintainability**: Removed hardcoded color values, unified CSS variables

---

## Description

With only one domain, you can create multiple different email addresses, similar to major email platforms. This project can be deployed on Cloudflare Workers to reduce server costs and build your own email service.

## Project Structure

```
cloud-mail
├── mail-worker				    # Backend worker project
│   ├── src
│   │   ├── api	 			    # API layer
│   │   ├── const  			    # Project constants
│   │   ├── dao                 # Data access layer
│   │   ├── email			    # Email processing and handling
│   │   ├── entity			    # Database entities
│   │   ├── error			    # Custom exceptions
│   │   ├── hono			    # Web framework, middleware, error handling
│   │   ├── i18n			    # Internationalization
│   │   ├── init			    # Database and cache initialization
│   │   ├── model			    # Response data models
│   │   ├── security			# Authentication and authorization
│   │   ├── service			    # Business logic layer
│   │   ├── template			# Message templates
│   │   ├── utils			    # Utility functions
│   │   └── index.js			# Entry point
│   ├── package.json			# Project dependencies
│   └── wrangler.toml			# Project configuration
│
├── mail-vue				    # Frontend Vue project
│   ├── src
│   │   ├── axios 			    # Axios configuration
│   │   ├── components			# Custom components
│   │   ├── composables			# Composables (new: useTheme)
│   │   ├── echarts			    # ECharts integration
│   │   ├── i18n			    # Internationalization
│   │   ├── init			    # Startup initialization
│   │   ├── layout			    # Main layout components
│   │   ├── perm			    # Permissions and access control
│   │   ├── request			    # API request layer
│   │   ├── router			    # Router configuration
│   │   ├── store			    # Global state management
│   │   ├── utils			    # Utility functions
│   │   ├── views			    # Page components
│   │   ├── app.vue			    # Root component
│   │   ├── main.js			    # Entry JS file
│   │   └── style.css			# Global styles
│   └── package.json			# Project dependencies
└── env.release					# Environment configuration
```

## License

This project is licensed under the [MIT](LICENSE) license.
