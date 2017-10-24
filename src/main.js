import Vue from 'vue';
import App from './App';
import axios from 'axios';
//ElementUI 相关
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';    // 默认主题
import "babel-polyfill";
//路由相关
import VueRouter from 'vue-router';
import Routers from './router';
//基础工具类
import ApiUtils from './utils/ApiUtils';
import CookieUtils from './utils/CookieUtils';

//开启配置
Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.prototype.$axios = axios;

// 路由配置
const RouterConfig = {
    mode: 'history', //HTML5 History 模式
    routes: Routers
};
const router = new VueRouter(RouterConfig);

//请求之前执行
router.beforeEach((to, from, next) => {
    if (to.meta.ignoreAuth) {
        //如果不需要登录验证
        next();
    } else {
        //如果需要登录
        //验证用户名和remember_token
        let username = CookieUtils.getCookie('cp_username');
        let token = CookieUtils.getCookie('cp_remember_token');
        console.log('username:' + username);
        console.log('token:' + token);
        if (username === null || token === null) {
            next({
                path: '/login',
                query: {redirect: to.fullPath}
            })
        }
        else {
            //传到后台服务器校验token
            let params = {
                username: username,
                token: token
            };
            ApiUtils.checkRememberToken(params).then(
                function (data) {
                    if (data.code === 0 || data.code === 4) {
                        //校验成功
                        next();
                    } else {
                        //校验失败
                        next({
                            path: '/login',
                            query: {redirect: to.fullPath}
                        })
                    }
                }
            ).catch(function (error) {
                next({
                    path: '/login',
                    query: {redirect: to.fullPath}
                });
                // console.log(error);
                // console.log('error:' + JSON.stringify(error));
            });
        }
    }
});

//请求之后执行
router.afterEach((to, from, next) => {
    window.scrollTo(0, 0);
});

//构造函数
new Vue({
    el: '#app',
    router: router,
    render: h => h(App)
});
