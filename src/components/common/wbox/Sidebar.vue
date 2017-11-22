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
                        title: '项目管理',
                        subs: [
                            {
                                index: '/wbox/myprojects',
                                title: '我的项目'
                            },
                            {
                                index: '/wbox/createproject',
                                title: '创建项目'
                            }
                        ]
                    },
                    // {
                    //     icon: 'el-icon-document',
                    //     index: '2',
                    //     title: 'Wbox管理',
                    //     subs: [
                    //         {
                    //             index: '/wbox/mywboxs',
                    //             title: '我的Wbox'
                    //         },
                    //         {
                    //             index: '/wbox/createwbox',
                    //             title: '创建Wbox'
                    //         },
                    //     ]
                    // },
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
