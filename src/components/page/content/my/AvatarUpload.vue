<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-setting"></i>个人设置</el-breadcrumb-item>
                <el-breadcrumb-item>设置头像</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div>
            <div style="height: 50px;">
                <img class="avatar-img" v-bind:src="avatarImg"/>

                <el-button class="avatar-btn" type="primary" icon="upload" @click="toggleShow">修改头像
                </el-button>

                <my-upload field="img"
                           @crop-upload-success="cropUploadSuccess"
                           @crop-upload-fail="cropUploadFail"
                           v-model="show"
                           :width="300"
                           :height="300"
                           v-bind:url="avatarUploadUrl"
                           :params="params"
                           :headers="headers"
                           img-format="png"></my-upload>
                <!--<img :src="imgDataUrl">-->
            </div>
        </div>
    </div>
</template>

<script>
    import 'babel-polyfill'; // es6 shim
    import myUpload from 'vue-image-crop-upload';
    import ApiUtils from '../../../../utils/ApiUtils';

    export default {
        data() {
            return {
                show: false,
                params: {
                    uid: localStorage.getItem('cp_uid'),
                },
                headers: {},
                imgDataUrl: '', // the datebase64 url of created image
                userlogo: '../../../static/img/img.jpg',
                avatarUploadUrl: ApiUtils.avatarUploadUrl,
            }
        },
        components: {
            'my-upload': myUpload
        },
        computed: {
            avatarImg() {
                let userlogo = localStorage.getItem('cp_userlogo');
                return userlogo == null || userlogo == 'null' ? this.userlogo : userlogo;
            }
        },
        methods: {
            toggleShow() {
                this.show = !this.show;
            },
            /**
             * upload success
             *
             * [param] jsonData   服务器返回数据，已进行json转码
             * [param] field
             */
            cropUploadSuccess(jsonData, field) {
                console.log('-------- upload success --------');
                if (jsonData.code == 0) {
                    localStorage.setItem('cp_userlogo', jsonData.data);
                    this.$message.success('上传头像成功');
                    //2秒后刷新页面
                    window.setTimeout(function () {
                        window.location.reload();
                    }, 2000);

                } else {
                    this.$message.error(jsonData.message);
                }
            },
            /**
             * upload fail
             *
             * [param] status    server api return error status, like 500
             * [param] field
             */
            cropUploadFail(status, field) {
                console.log('-------- upload fail --------');
                console.log(status);
                console.log('field: ' + field);
            }
        }

    }
</script>

<style scoped>

    .avatar-img {
        width: 200px;
        height: 200px;;
        border-radius: 50%;
    }

    .avatar-btn {
        margin-left: 40px;
    }
</style>
