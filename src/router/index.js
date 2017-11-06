const routers = [
    {
        path: '/',
        redirect: '/login'
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
    {
        //个人面板
        path: '/my',
        component: resolve => require(['../components/common/my/Home.vue'], resolve),
        children: [
            {
                path: 'mygroups',
                component: resolve => require(['../components/page/content/my/MyGroups.vue'], resolve),
            },
            {
                path: 'joingroup',
                component: resolve => require(['../components/page/content/my/JoinGroup.vue'], resolve),
            },
            {
                path: 'password',
                component: resolve => require(['../components/page/content/my/Password.vue'], resolve)
            },
            {
                path: 'profile',
                component: resolve => require(['../components/page/content/my/Profile.vue'], resolve)
            },
            {
                path: 'avatarupload',
                component: resolve => require(['../components/page/content/my/AvatarUpload.vue'], resolve)
            },

            //参考内容
            {
                path: 'readme',
                component: resolve => require(['../components/page/content/Readme.vue'], resolve)
            },
            {
                path: 'basetable',
                component: resolve => require(['../components/page/content/BaseTable.vue'], resolve)
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
        //管理面板
        path: '/board/:gid',
        component: resolve => require(['../components/common/board/Home.vue'], resolve),
        children: [
            {
                path: 'wiki/:rootId',
                component: resolve => require(['../components/page/content/board/Wiki.vue'], resolve),
            },
        ]
    },
    {
        //管理面板
        path: '/manage',
        component: resolve => require(['../components/common/manage/Home.vue'], resolve),
        children: [
            {
                path: 'manangegroups',
                component: resolve => require(['../components/page/content/manage/ManageGroups.vue'], resolve),
            },
            {
                path: 'managegroup',
                component: resolve => require(['../components/page/content/manage/ManageGroup.vue'], resolve),
            },
            {
                path: 'joingroup',
                component: resolve => require(['../components/page/content/my/JoinGroup.vue'], resolve),
            },
            {
                path: 'managecontents',
                component: resolve => require(['../components/page/content/manage/ManageContents.vue'], resolve),
            },
            {
                path: 'password',
                component: resolve => require(['../components/page/content/my/Password.vue'], resolve)
            },
            {
                path: 'profile',
                component: resolve => require(['../components/page/content/my/Profile.vue'], resolve)
            },
            {
                path: 'avatarupload',
                component: resolve => require(['../components/page/content/my/AvatarUpload.vue'], resolve)
            }
        ]
    },
    {
        //wbox服务平台
        path: '/wbox',
        component: resolve => require(['../components/common/wbox/Home.vue'], resolve),
        children: [
            {
                path: 'myprojects',
                component: resolve => require(['../components/page/wbox/myprojects.vue'], resolve),
            },
            {
                path: 'createproject',
                component: resolve => require(['../components/page/wbox/createproject.vue'], resolve),
            },
            {
                path: 'mywboxs',
                component: resolve => require(['../components/page/wbox/mywboxs.vue'], resolve),
            },
            {
                path: 'createwbox',
                component: resolve => require(['../components/page/wbox/createwbox.vue'], resolve),
            },
        ]
    },
];
export default routers;
