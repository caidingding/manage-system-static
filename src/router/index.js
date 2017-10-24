const routers = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/manage',
        component: resolve => require(['../components/common/Home.vue'], resolve),
        children: [
            {
                path: '/password',
                component: resolve => require(['../components/page/Password.vue'], resolve)
            },
            {
                path: '/profile',
                component: resolve => require(['../components/page/Profile.vue'], resolve)
            },
            {
                path: '/readme',
                component: resolve => require(['../components/page/Readme.vue'], resolve)
            },
            {
                path: '/basetable',
                component: resolve => require(['../components/page/BaseTable.vue'], resolve)
            },
            {
                path: '/vuetable',
                component: resolve => require(['../components/page/VueTable.vue'], resolve)     // vue-datasource组件
            },
            {
                path: '/baseform',
                component: resolve => require(['../components/page/BaseForm.vue'], resolve)
            },
            {
                path: '/vueeditor',
                component: resolve => require(['../components/page/VueEditor.vue'], resolve)    // Vue-Quill-Editor组件
            },
            {
                path: '/markdown',
                component: resolve => require(['../components/page/Markdown.vue'], resolve)     // Vue-Quill-Editor组件
            },
            {
                path: '/upload',
                component: resolve => require(['../components/page/Upload.vue'], resolve)       // Vue-Core-Image-Upload组件
            },
            {
                path: '/basecharts',
                component: resolve => require(['../components/page/BaseCharts.vue'], resolve)   // vue-schart组件
            },
            {
                path: '/drag',
                component: resolve => require(['../components/page/DragList.vue'], resolve)    // 拖拽列表组件
            }
        ]
    },
    {
        path: '/login',
        meta: {ignoreAuth: true},
        component: resolve => require(['../components/page/Login.vue'], resolve)
    },
    {
        path: '/register',
        meta: {ignoreAuth: true},
        component: resolve => require(['../components/page/Register.vue'], resolve)
    },
];
export default routers;
