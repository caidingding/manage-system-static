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
                path: 'mygroups',
                component: resolve => require(['../components/page/content/MyGroups.vue'], resolve),
            },
            {
                path: 'manangegroup',
                component: resolve => require(['../components/page/content/ManageGroup.vue'], resolve),
            },
            {
                path: 'grouphall',
                component: resolve => require(['../components/page/content/GroupHall.vue'], resolve),
            },
            {
                path: 'password',
                component: resolve => require(['../components/page/content/Password.vue'], resolve)
            },
            {
                path: 'profile',
                component: resolve => require(['../components/page/content/Profile.vue'], resolve)
            },
            {
                path: 'readme',
                component: resolve => require(['../components/page/content/Readme.vue'], resolve)
            },
            {
                path: 'basetable',
                component: resolve => require(['../components/page/content/BaseTable.vue'], resolve)
            },
            {
                path: 'vuetable',
                component: resolve => require(['../components/page/content/VueTable.vue'], resolve)     // vue-datasource组件
            },
            {
                path: 'baseform',
                component: resolve => require(['../components/page/content/BaseForm.vue'], resolve)
            },
            {
                path: 'vueeditor',
                component: resolve => require(['../components/page/content/VueEditor.vue'], resolve)    // Vue-Quill-Editor组件
            },
            {
                path: 'markdown',
                component: resolve => require(['../components/page/content/Markdown.vue'], resolve)     // Vue-Quill-Editor组件
            },
            {
                path: 'upload',
                component: resolve => require(['../components/page/content/Upload.vue'], resolve)       // Vue-Core-Image-Upload组件
            },
            {
                path: 'basecharts',
                component: resolve => require(['../components/page/content/BaseCharts.vue'], resolve)   // vue-schart组件
            },
            {
                path: 'drag',
                component: resolve => require(['../components/page/content/DragList.vue'], resolve)    // 拖拽列表组件
            }
        ]
    },
    {
        path: '/login',
        meta: {ignoreAuth: true},
        component: resolve => require(['../components/page/content/Login.vue'], resolve)
    },
    {
        path: '/register',
        meta: {ignoreAuth: true},
        component: resolve => require(['../components/page/content/Register.vue'], resolve)
    },
];
export default routers;
