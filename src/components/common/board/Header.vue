<template>
    <div class="header">
        <div class="logo">内容平台群组功能</div>
        <div class="right-menus">
            <div class="menu">
                <el-menu
                    mode="horizontal"
                    @select="handleHeaderMenuSelect"
                    background-color="#242f42"
                    text-color="#fff"
                    active-text-color="#ffd04b">
                    <el-submenu index="wiki" v-if="hasWiki">
                        <template slot="title">WIKI内容</template>
                        <el-menu-item :index="''+subItem.id" v-for="(subItem,subIndex) in wikiRoots">
                            {{subItem.name}}
                        </el-menu-item>
                    </el-submenu>
                    <el-menu-item index="my">个人中心</el-menu-item>
                    <el-menu-item index="manage">管理后台</el-menu-item>
                    <el-menu-item index="wbox">WBOX服务平台</el-menu-item>
                </el-menu>
            </div>
            <div class="user-info">
                <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link">
                    <img class="user-logo" v-bind:src="userLogo">
                    {{username}}
                </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="loginout">退出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>
<script>
    import CookieUtils from '../../../utils/CookieUtils';
    import ApiUtils from '../../../utils/ApiUtils';

    export default {
        data() {
            return {
                name: 'username',
                logo: '../../../static/img/img.jpg',
                hasWiki: true,
                wikiRoots: [],
                groupId: this.$route.params.gid,
            }
        },
        computed: {
            username() {
                let username = localStorage.getItem('cp_username');
                return username ? username : this.name;
            },
            userLogo() {
                let userlogo = localStorage.getItem('cp_userlogo');
                return userlogo == null || userlogo == 'null' ? this.logo : userlogo;
            }
        },
        methods: {
            handleCommand(command) {
                if (command == 'loginout') {
                    localStorage.removeItem('cp_username');
                    CookieUtils.deleteCookie('cp_uid');
                    CookieUtils.deleteCookie('cp_username');
                    CookieUtils.deleteCookie('cp_email');
                    CookieUtils.deleteCookie('cp_remember_token');
                    this.$router.push('/login');
                }
            },
            handleHeaderMenuSelect(key, keyPath) {
                if (key == 'my') {
                    //管理后台
                    this.$router.push({path: '/my'});
                } else if (key == 'manage') {
                    //管理后台
                    this.$router.push({path: '/manage'});
                } else if (key == 'wbox') {
                    //wbox服务后台
                    this.$router.push({path: '/wbox'});
                }
                if (keyPath.length === 2) {
                    if (keyPath[0] === 'wiki') {
                        let treeRootId = keyPath[1];//tree的root id
                        //跳转到对应的wiki页面
                        let wikiPath = '/board/' + this.groupId + '/wiki/' + treeRootId;
                        this.$router.push({path: wikiPath});
                    }
                }
            },
            getWikiRoots() {
                let self = this;
                let groupId = self.$route.params.gid;
                //取群组列表数据到表中
                let params = {
                        username: localStorage.getItem('cp_username'),
                        groupId: groupId
                    }
                ;
                ApiUtils.getAuthorizedTreeRoots(params).then(function (data) {
                    if (data.code === 100) {
                        if (data.data.length == 0) {
                            self.hasWiki = false;
                        } else {
                            self.hasWiki = true;
                        }
                        self.wikiRoots = data.data;
                    } else {
                        //失败提示
                        console.log(data.message);
                        self.$message.error(data.message);
                    }
                });
            }
        },
        created: function () {
            this.getWikiRoots();
        }
    }
</script>
<style scoped>
    .header {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 60px;
        font-size: 22px;
        line-height: 60px;
        color: #fff;
    }

    .header .logo {
        float: left;
        width: 250px;
        text-align: center;
    }

    .right-menus {
        float: right;
        padding-right: 50px;
    }

    .menu {
        height: 60px;
        float: left;
        padding-right: 50px;
        font-size: 16px;
        color: #fff;
    }

    .user-info {
        float: left;
        padding-right: 50px;
        font-size: 16px;
        color: #fff;
    }

    .user-info .el-dropdown-link {
        position: relative;
        display: inline-block;
        padding-left: 50px;
        color: #fff;
        cursor: pointer;
        vertical-align: middle;
    }

    .user-info .user-logo {
        position: absolute;
        left: 0;
        top: 10px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }

    el-dropdown-item {
        text-align: center;
    }
</style>
