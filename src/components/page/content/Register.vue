<template>
    <div class="register-wrap">
        <div class="ms-title">内容平台</div>
        <div class="ms-register">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="email">
                    <el-input v-model="ruleForm.email" placeholder="邮箱地址"></el-input>
                </el-form-item>
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="用户名"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="密码" v-model="ruleForm.password"
                              @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <el-form-item prop="repeatPassword">
                    <el-input type="password" placeholder="重复密码" v-model="ruleForm.repeatPassword"
                              @keyup.enter.native="submitForm('ruleForm')"></el-input>
                </el-form-item>
                <div class="register-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">注册</el-button>
                </div>
                <p style="font-size:12px;line-height:30px;color:#999;">已有账号？去<a href="login">登录</a></p>
            </el-form>
        </div>
    </div>
</template>

<script>
    import ApiUtils from '../../../utils/ApiUtils';

    export default {
        data: function () {
            //文本框校验
            const validateUsername = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('用户名不能为空'));
                }
                if (!/^[a-zA-Z0-9]+$/.test(value)) {
                    return callback(new Error('用户名只能由字母和数字组成'));
                }
                //异步验证效果
                let params = {
                    username: value
                };
                ApiUtils.checkUserName(params).then(
                    function (data) {
                        if (data.code === 0 || data.code === 4) {
                            callback();
                        } else {
                            callback(new Error(data.message));
                        }
                    }
                ).catch(function (error) {
                    console.log(error);
                    console.log('error:' + JSON.stringify(error));
                    callback(new Error('服务器异常,无法校验用户名'));
                });
            };
            const validateRepeatPassword = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.ruleForm.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                ruleForm: {
                    email: '',
                    username: '',
                    password: '',
                    repeatPassword: ''
                },
                rules: {
                    email: [
                        {required: true, message: '请输入邮箱地址', trigger: 'blur'},
                        {type: 'email', message: '邮箱地址格式有误', trigger: 'blur'}
                    ],
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                        {validator: validateUsername, trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur'}
                    ],
                    repeatPassword: [
                        {required: true, message: '请重复密码', trigger: 'blur'},
                        {type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur'},
                        {validator: validateRepeatPassword, trigger: 'blur'}
                    ],

                }
            }
        },
        methods: {
            submitForm(formName) {
                const self = this;
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        //提交注册信息
                        let params = {
                            email: self.ruleForm.email,
                            username: self.ruleForm.username,
                            password: self.ruleForm.password
                        };
                        ApiUtils.register(params).then(function (data) {
                            if (data.code === 0) {
                                //注册成功!
                                self.$message.success('注册成功!3秒后转入登录页');
                                localStorage.setItem('cp_username', self.ruleForm.username);
                                window.setTimeout(function () {
                                    self.$router.push('/login');
                                }, 3000);
                            } else {
                                //失败提示
                                self.$message.error(data.message);
                            }
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
    .register-wrap {
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

    .ms-register {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 300px;
        height: 280px;
        margin: -150px 0 0 -190px;
        padding: 40px;
        border-radius: 5px;
        background: #fff;
    }

    .register-btn {
        text-align: center;
    }

    .register-btn button {
        width: 100%;
        height: 36px;
    }
</style>
