import {createRouter, createWebHistory} from 'vue-router'
import NProgress from 'nprogress';
import {useUiStore} from "@/store/ui.js";
import {useSettingStore} from "@/store/setting.js";
import {cvtR2Url} from "@/utils/convert.js";

const routes = [
    {
        path: '/',
        name: 'layout',
        redirect: '/inbox',
        component: () => import('@/layout/index.vue'),
        children: [
            {
                path: '/inbox',
                name: 'email',
                component: () => import('@/views/email/index.vue'),
                meta: {
                    title: 'inbox',
                    name: 'email',
                    menu: true
                }
            },
            {
                path: '/message',
                name: 'content',
                component: () => import('@/views/content/index.vue'),
                meta: {
                    title: 'message',
                    name: 'content',
                    menu: false
                }
            },
            {
                path: '/settings',
                name: 'setting',
                component: () => import('@/views/setting/index.vue'),
                meta: {
                    title: 'settings',
                    name: 'setting',
                    menu: true
                }
            },
            {
                path: '/starred',
                name: 'star',
                component: () => import('@/views/star/index.vue'),
                meta: {
                    title: 'starred',
                    name: 'star',
                    menu: true
                }
            },
            {
                path: '/send',
                name: 'send',
                component: () => import('@/views/send/index.vue'),
                meta: {
                    title: 'sent',
                    name: 'send',
                    menu: true
                }
            },
            {
                path: '/draft',
                name: 'draft',
                component: () => import('@/views/draft/index.vue'),
                meta: {
                    title: 'drafts',
                    name: 'draft',
                    menu: true
                }
            },
            {
                path: '/analysis',
                name: 'analysis',
                component: () => import('@/views/analysis/index.vue'),
                meta: {
                    title: 'analytics',
                    name: 'analysis',
                    menu: true
                }
            },
            {
                path: '/user',
                name: 'user',
                component: () => import('@/views/user/index.vue'),
                meta: {
                    title: 'allUsers',
                    name: 'user',
                    menu: true
                }
            },
            {
                path: '/all-email',
                name: 'all-email',
                component: () => import('@/views/all-email/index.vue'),
                meta: {
                    title: 'allMail',
                    name: 'all-email',
                    menu: true
                }
            },
            {
                path: '/role',
                name: 'role',
                component: () => import('@/views/role/index.vue'),
                meta: {
                    title: 'permissions',
                    name: 'role',
                    menu: true
                }
            },
            {
                path: '/reg-key',
                name: 'reg-key',
                component: () => import('@/views/reg-key/index.vue'),
                meta: {
                    title: 'inviteCode',
                    name: 'reg-key',
                    menu: true
                }
            },
            {
                path: '/sys-setting',
                name: 'sys-setting',
                component: () => import('@/views/sys-setting/index.vue'),
                meta: {
                    title: 'SystemSettings',
                    name: 'sys-setting',
                    menu: true
                }
            },
        ]

    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/index.vue')
    },
    {
        path: '/test',
        name: 'test',
        component: () => import('@/views/test/index.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        name: '404',
        component: () => import('@/views/404/index.vue')
    }
]


const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

NProgress.configure({
    showSpinner: false,   // 不显示旋转图标
    trickleSpeed: 50,    // 自动递增速度
    minimum: 0.1          // 最小百分比
});

let timer
let first = true

router.beforeEach((to, from, next) => {

    if (timer) {
        clearTimeout(timer)
    }

    if (!first) {
        timer = setTimeout(() => {
            NProgress.start()
        }, 100)
    }

    const token = localStorage.getItem('token')

    if (!token && to.name !== 'login') {
        return next({name: 'login'})
    }

    if (!token && to.name === 'login') {
        loadBackground(next)
        return
    }

    if (token && to.name === 'login') {
        return next(from.path)
    }

    next()

})

function loadBackground(next) {

    const settingStore = useSettingStore();

    if (settingStore.settings.background) {

        const src = cvtR2Url(settingStore.settings.background);

        const img = new Image();
        img.src = src;

        img.onload = () => {
            next()
        };

        img.onerror = () => {
            console.warn("背景图片加载失败:", img.src);
            next()
        };

        setTimeout(() => {
            console.warn("背景加载超时，已放行");
            next()
        }, 3000)

    } else {
        next()
    }

}

router.afterEach((to) => {

    clearTimeout(timer)
    if (first) {
        removeLoading()
    } else {
        NProgress.done();
    }

    const uiStore = useUiStore()
    if (to.meta.menu) {
        if (['content', 'email', 'send'].includes(to.meta.name)) {
            uiStore.accountShow = window.innerWidth > 767;
        } else {
            uiStore.accountShow = false
        }
    }

    if (window.innerWidth < 1025) {
        uiStore.asideShow = false
    }

    first = false
})

function removeLoading() {
    const doc = document.getElementById('loading-first');
    if (!doc) {
        return;
    }

    doc.remove()
}

export default router
