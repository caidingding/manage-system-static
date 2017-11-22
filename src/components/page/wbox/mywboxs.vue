<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-share"></i>Wbox管理</el-breadcrumb-item>
                <el-breadcrumb-item>我的Wbox</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-button type="primary" icon="plus" class="mr10" @click="createProject">创建Wbox</el-button>
            <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10" icon="search"></el-input>
        </div>
        <el-table :data="data" border style="width: 100%" ref="multipleTable">
            <el-table-column
                label="所属项目名称"
                width="180">
                <template scope="scope">
                    <el-popover trigger="hover" placement="top">
                        <p>项目ID: {{ scope.row.id }}</p>
                        <p>项目简介: {{ scope.row.desc }}</p>
                        <div slot="reference" class="name-wrapper">
                            <p>{{ scope.row.name }}</p>
                            <p style="color:#d8dce5">{{ scope.row.ename }}</p>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                label="创建者"
                width="180">
                <template scope="scope">
                    <el-popover trigger="hover" placement="top">
                        <p>ID: {{ scope.row.creator_id }}</p>
                        <p>用户名: {{ scope.row.creator_name }}</p>
                        <div slot="reference" class="name-wrapper">
                            <el-tag type="danger">{{ scope.row.creator_name }}</el-tag>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                label="创建时间"
                width="200">
                <template scope="scope">
                    <el-icon name="time"></el-icon>
                    <span style="margin-left: 10px">{{ scope.row.created_at }}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="tag"
                label="状态"
                width="100"
                :filters="[{ text: '进行中', value: 0 }, { text: '暂停', value: 1 },{ text: '完结', value: 2 }]"
                :filter-method="filterStatus"
                filter-placement="bottom-end">
                <template scope="scope">
                    <el-tag v-if="scope.row.status == 0"
                        type="success"
                        close-transition>进行中
                    </el-tag>
                    <el-tag v-if="scope.row.status == 1"
                        type="danger"
                        close-transition>暂停
                    </el-tag>
                    <el-tag v-if="scope.row.status == 2"
                        type="warning"
                        close-transition>完结
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column
                prop="tag"
                label="标签"
                width="100"
                :filters="[{ text: '我创建的', value: true }, { text: '我参与的', value: false }]"
                :filter-method="filterTag"
                filter-placement="bottom-end">
                <template scope="scope">
                    <el-tag
                        :type="scope.row.owner ? 'primary' : 'success'"
                        close-transition>{{scope.row.owner ? '我创建的' : '添加我的'}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button v-if="scope.row.owner"
                               size="small"
                               type="info"
                               @click="handleManage(scope.$index, scope.row)">管理
                    </el-button>
                    <el-button v-if="scope.row.owner"
                               size="small"
                               type="danger"
                               @click="delManage(scope.$index, scope.row)">删除
                    </el-button>
                    <el-button v-if="!scope.row.owner"
                               size="small"
                               type="success"
                               @click="infosManage(scope.$index, scope.row)">详情
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import WboxApiUtils from '../../../utils/WboxApiUtils';

    export default {
        data() {
            return {
                tableData: [],
                select_word: '',
                currentPage: 1,
                page_size:20,
            }
        },
         created() {
             this.getData();
         },
        methods: {
          getData() {
                let self = this;
                //取群组列表数据到表中
                let params = {
                    username: localStorage.getItem('cp_username')
                };
                WboxApiUtils.getMyProjects(params).then(function (data) {
                    if (data.code === 100) {
                        self.tableData = data.data;
                    } else {
                        //失败提示
                        console.log(data.message);
                        self.$message.error('服务器出错了，加载列表数据失败');
                    }
                });
            },
            //筛选标签
            filterTag(value, row) {
                return row.owner === value;
            },
            //状态筛选
            filterStatus(value,row){
              return row.status === value;
            },
            //管理按钮
            handleManage(index, row) {
                alert("待完成");
            },
            //删除按钮
            delManage(index,row){
                const self = this;
                let content = '此操作将永久删除  '+row.name+' , 是否继续?';
                self.$confirm(content, '提示', {
                 confirmButtonText: '确定',
                 cancelButtonText: '取消',
                 type: 'warning'
               }).then(() =>{
                 self.toDelProject(row.id);
               }
               ).catch(() => {
                 self.$message({
                   type: 'info',
                   message: '已取消删除'
                 });
               });
             },
             //删除项目
             toDelProject(pid){
               const self = this;
               let params = {
                 username:localStorage.getItem('cp_username'),
                 pid:pid
               }
              WboxApiUtils.delProject(params).then(function (data) {
                if(data.code === 100){
                  self.$message({
                    type: 'success',
                    message: '删除成功'
                  });
                  self.getData();
                }else{
                  self.$message({
                    type: 'danger',
                    message: '删除失败'
                  });
                  console.log(data.data);
                }
              });
             },
            //查看详情
            infosManage(index,row){
              alert("待完成");
            },
            createProject() {
                this.$router.push('/wbox/createproject');
            },
            submitForm(formName) {
                const self = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
          },
        computed: {
            data() {
                const self = this;
                return self.tableData.filter(function (d) {
                    if (d.name.indexOf(self.select_word) > -1 ||
                        d.creator_name.indexOf(self.select_word) > -1 ||
                        d.created_at.indexOf(self.select_word) > -1
                    ) {
                        return d;
                    }
                });
            }
        },
    }
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
</style>
