<template>
    <div class="sidebar">
        <el-menu :default-active="onRoutes" class="el-menu-vertical-manage" theme="dark" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index">
                        <template slot="title"><i :class="item.icon"></i>{{ item.title }}</template>
                        <el-menu-item v-for="(subItem,i) in item.subs" :key="i" :index="subItem.index">{{ subItem.title
                            }}
                        </el-menu-item>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index">
                        <i :class="item.icon"></i>{{ item.title }}
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                items: [
                    {
                        icon: 'el-icon-share',
                        index: '1',
                        title: '群组管理',
                        subs: [
                            {
                                index: '/my/mygroups',
                                title: '我的群组'
                            },
                            {
                                index: '/my/joingroup',
                                title: '加入群组'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-setting',
                        index: '3',
                        title: '个人设置',
                        subs: [
                            {
                                index: '/my/password',
                                title: '密码修改'
                            },
                            {
                                index: '/my/profile',
                                title: '个人资料'
                            },
                            {
                                index: '/my/avatarupload',
                                title: '头像上传'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-date',
                        index: '4',
                        title: '参考',
                        subs: [
                            {
                                index: '/my/readme',
                                title: '自述'
                            },
                            {
                                index: '/my/basetable',
                                title: '基础表格'
                            },
                            {
                                index: '/my/vuetable',
                                title: 'Vue表格组件'
                            },
                            {
                                index: '/my/baseform',
                                title: '基本表单'
                            },
                            {
                                index: '/my/vueeditor',
                                title: '编辑器'
                            },
                            {
                                index: '/my/markdown',
                                title: 'markdown'
                            },
                            {
                                index: '/my/upload',
                                title: '文件上传'
                            },
                            {
                                index: '/my/basecharts',
                                title: '图表'
                            },
                            {
                                index: '/my/drag',
                                title: '拖拽'
                            }
                        ]
                    }
                ]
            }
        },
        computed: {
            onRoutes() {
                return this.$route.path.replace('/', '');
            }
        }
    }
</script>

<style scoped>
    .sidebar {
        display: block;
        position: absolute;
        width: 200px;
        height: auto;
        left: 0;
        top: 60px;
        bottom: 0;
        background: #2E363F;
    }

    .sidebar > ul {
        height: 100%;
    }

</style>
