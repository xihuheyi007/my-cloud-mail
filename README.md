<p align="center">
    <img src="doc/demo/logo.png" width="80px" />
    <h1 align="center">Cloud Mail</h1>
    <p align="center">基于 Cloudflare 的简约响应式邮箱服务，支持邮件发送、附件收发 🎉</p>
    <p align="center">
        简体中文 | <a href="/README-en.md" style="margin-left: 5px">English </a>
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

> ⚠️ **本项目基于 [maillab/cloud-mail](https://github.com/maillab/cloud-mail) 修改而来，继承其所有功能。**

---

## 项目修改说明

本项目对原项目进行了以下 UI 优化：

### 🌗 主题模式升级

- **三种主题模式**：浅色模式 / 深色模式 / 跟随系统
- **自动切换**：支持监听系统主题偏好，实时响应系统主题变化
- **持久化保存**：用户选择的主题模式会自动保存

### 📂 侧边栏优化

- **默认折叠**：侧边栏默认折叠为图标模式（60px 宽度）
- **按需展开**：点击汉堡按钮展开完整菜单
- **颜色适配**：浅色模式下侧边栏为浅色背景，深色模式下为深色背景
- **流畅动画**：折叠/展开采用平滑过渡动画

### 🎨 现代 UI 设计

- **卡片式布局**：邮件列表采用现代卡片设计，带圆角和阴影
- **Hover 效果**：卡片悬停有微妙的阴影提升效果
- **统一配色**：全部使用 CSS 变量，便于主题切换

### 🔧 技术改进

- **状态管理重构**：分离桌面端折叠状态与移动端抽屉状态
- **主题 Composable**：新增 `useTheme.js` 统一管理主题逻辑
- **代码可维护性**：移除硬编码颜色值，统一使用 CSS 变量

---

## 目录结构

```
cloud-mail
├── mail-worker				    # worker后端项目
│   ├── src
│   │   ├── api	 			    # api接口层
│   │   ├── const  			    # 项目常量
│   │   ├── dao                 # 数据访问层
│   │   ├── email			    # 邮件处理接收
│   │   ├── entity			    # 数据库实体
│   │   ├── error			    # 自定义异常
│   │   ├── hono			    # web框架配置、拦截器、全局异常等
│   │   ├── i18n			    # 语言国际化
│   │   ├── init			    # 数据库缓存初始化
│   │   ├── model			    # 响应体数据封装
│   │   ├── security			# 身份权限认证
│   │   ├── service			    # 业务服务层
│   │   ├── template			# 消息模板
│   │   ├── utils			    # 工具类
│   │   └── index.js			# 入口文件
│   ├── pageckge.json			# 项目依赖
│   └── wrangler.toml			# 项目配置
│
├── mail-vue				    # vue前端项目
│   ├── src
│   │   ├── axios 			    # axios配置
│   │   ├── components			# 自定义组件
│   │   ├── composables			# 组合式函数（新增 useTheme）
│   │   ├── echarts			    # echarts组件导入
│   │   ├── i18n			    # 语言国际化
│   │   ├── init			    # 入站初始化
│   │   ├── layout			    # 主体布局组件
│   │   ├── perm			    # 权限认证
│   │   ├── request			    # api接口
│   │   ├── router			    # 路由配置
│   │   ├── store			    # 全局状态管理
│   │   ├── utils			    # 工具类
│   │   ├── views			    # 页面组件
│   │   ├── app.vue			    # 入口组件
│   │   ├── main.js			    # 入口js
│   │   └── style.css			# 全局css
│   └── package.json			# 项目依赖
└── env.release					# 项目配置
```

## 许可证

本项目采用 [MIT](LICENSE) 许可证
