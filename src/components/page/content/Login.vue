<template>
    <div class="login-wrap">
        <div class="ms-title">内容平台</div>
        <div class="ms-login">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="密码" v-model="ruleForm.password"
                              @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>
                <p style="font-size:12px;line-height:30px;color:#999;">没有账号？去<a href="/register">注册</a></p>
            </el-form>
        </div>
    </div>
</template>

<script>
    import ApiUtils from '../../../utils/ApiUtils';
    import CookieUtils from '../../../utils/CookieUtils';

    export default {
        data: function () {
            return {
                ruleForm: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ]
                }
            }
        },
        methods: {
            submitForm(formName) {
                const self = this;
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        //验证登录信息
                        let params = {
                            username: self.ruleForm.username,
                            password: self.ruleForm.password
                        };
                        ApiUtils.login(params).then(function (data) {
                            if (data.code === 0) {
                                //验证成功!
                                localStorage.setItem('cp_username', self.ruleForm.username);
                                CookieUtils.setCookie('cp_uid', data.data.id, 1);
                                CookieUtils.setCookie('cp_username', data.data.name, 1);
                                CookieUtils.setCookie('cp_email', data.data.email, 1);
                                CookieUtils.setCookie('cp_remember_token', data.data.remember_token, 1);
                                let redirect = self.$route.query.redirect;
                                if (redirect) {
                                    self.$router.push({path: redirect});
                                } else {
                                    self.$router.push('/manage');
                                }
                            } else {
                                //失败提示
                                self.$message.error(data.message);
                            }
                        }).catch((msg) => {
                            //提示网络错误
                            self.$notify.error({
                                title: '网络异常',
                                message: msg.toString()
                            });
                        });

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .login-wrap {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .ms-title {
        position: absolute;
        top: 50%;
        width: 100%;
        margin-top: -230px;
        text-align: center;
        font-size: 30px;
        color: #fff;

    }

    .ms-login {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 300px;
        height: 160px;
        margin: -150px 0 0 -190px;
        padding: 40px;
        border-radius: 5px;
        background: #fff;
    }

    .login-btn {
        text-align: center;
    }

    .login-btn button {
        width: 100%;
        height: 36px;
    }
</style>
