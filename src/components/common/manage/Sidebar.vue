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
                                index: '/manage/manangegroups',
                                title: '管理群组'
                            },
                            {
                                index: '/manage/joingroup',
                                title: '加入群组'
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-document',
                        index: '2',
                        title: '内容管理',
                        subs: [
                            {
                                index: '/manage/managecontents',
                                title: '管理内容'
                            },
                        ]
                    },
                    {
                        icon: 'el-icon-setting',
                        index: '3',
                        title: '个人设置',
                        subs: [
                            {
                                index: '/manage/password',
                                title: '密码修改'
                            },
                            {
                                index: '/manage/profile',
                                title: '个人资料'
                            },
                            {
                                index: '/manage/avatarupload',
                                title: '头像上传'
                            }
                        ]
                    },

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
