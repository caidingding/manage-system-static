<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-setting"></i>个人设置</el-breadcrumb-item>
                <el-breadcrumb-item>密码修改</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="form-box">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                <el-form-item prop="oldPassword" label="当前密码">
                    <el-input type="password" placeholder="请输入" v-model="form.oldPassword"></el-input>
                </el-form-item>
                <el-form-item prop="newPassword" label="新的密码">
                    <el-input type="password" placeholder="请输入" v-model="form.newPassword"></el-input>
                </el-form-item>
                <el-form-item prop="repeatPassword" label="新的密码">
                    <el-input type="password" placeholder="请再次输入" v-model="form.repeatPassword"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit('form')">修改</el-button>
                </el-form-item>
            </el-form>
        </div>

    </div>
</template>

<script>
    import ApiUtils from '../../utils/ApiUtils';
    import CookieUtils from '../../utils/CookieUtils';

    export default {
        data: function () {
            const validateRepeatPassword = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.form.newPassword) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                form: {
                    oldPassword: '',
                    newPassword: '',
                    repeatPassword: '',
                },
                rules: {
                    oldPassword: [
                        {required: true, message: '请输入当前密码', trigger: 'blur'}
                    ],
                    newPassword: [
                        {required: true, message: '请输入新的密码', trigger: 'blur'},
                        {type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur'}
                    ],
                    repeatPassword: [
                        {required: true, message: '请再次输入新的密码', trigger: 'blur'},
                        {type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur'},
                        {validator: validateRepeatPassword, trigger: 'blur'}
                    ],
                }
            }
        },
        methods: {
            onSubmit(formName) {
                const self = this;
                self.$refs[formName].validate((valid) => {
                    if (valid) {
                        //异步修改密码
                        let params = {
                            username: localStorage.getItem('cp_username'),
                            oldPassword: self.form.oldPassword,
                            newPassword: self.form.newPassword
                        };
                        ApiUtils.changePassword(params).then(function (data) {
                            if (data.code === 0) {
                                //修改密码成功!
                                self.$message.success('密码修改成功！');
                                CookieUtils.deleteCookie('cp_remember_token');
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
