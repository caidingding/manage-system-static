<template>
    <div class="header">
        <div class="logo">WBOX服务平台</div>
        <div class="right-menus">
            <div class="menu">
                <el-menu
                    mode="horizontal"
                    @select="handleHeaderMenuSelect"
                    background-color="#242f42"
                    text-color="#fff"
                    active-text-color="#ffd04b">
                    <el-menu-item index="my">个人中心</el-menu-item>
                    <el-menu-item index="manage">管理平台</el-menu-item>
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

    export default {
        data() {
            return {
                name: 'username',
                logo: '../../../static/img/img.jpg',
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
                    //个人中心
                    this.$router.push({path: '/my'});
                } else if (key == 'manage') {
                    //管理后台
                    this.$router.push({path: '/manage'});
                }
            }
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
        float: right;
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
