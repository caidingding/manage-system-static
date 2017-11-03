<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-share"></i>群组管理</el-breadcrumb-item>
                <el-breadcrumb-item>管理群组</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-button type="primary" icon="plus" class="mr10" @click="createGroup">创建群组</el-button>
            <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10" icon="search"></el-input>
        </div>
        <el-table :data="data" border style="width: 100%" ref="multipleTable">
            <el-table-column
                label="群组名称"
                width="180">
                <template scope="scope">
                    <el-popover trigger="hover" placement="top">
                        <p>群组ID: {{ scope.row.id }}</p>
                        <p>简介: {{ scope.row.desc }}</p>
                        <div slot="reference" class="name-wrapper">
                            <el-tag>{{ scope.row.name }}</el-tag>
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
                label="更新时间"
                width="200">
                <template scope="scope">
                    <el-icon name="time"></el-icon>
                    <span style="margin-left: 10px">{{ scope.row.updated_at }}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="tag"
                label="标签"
                width="100"
                :filters="[{ text: '我创建的', value: true }, { text: '添加我的', value: false }]"
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
                               type="success"
                               @click="handleManage(scope.$index, scope.row)">管理
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div>
            <el-dialog title="创建群组" :visible.sync="createGroupDialogFormVisible">
                <el-form :model="createGroupForm" :rules="createGroupFormRules" ref="createGroupForm"
                         label-width="100px" class="demo-ruleForm">
                    <el-form-item label="群组名称" prop="groupName">
                        <el-input v-model="createGroupForm.groupName"></el-input>
                    </el-form-item>
                    <el-form-item label="群组简介" prop="groupDesc">
                        <el-input type="textarea" v-model="createGroupForm.groupDesc"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="resetForm('createGroupForm')">取 消</el-button>
                    <el-button type="primary" @click="submitForm('createGroupForm')">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import ApiUtils from '../../../../utils/ApiUtils';

    export default {
        data() {
            return {
                tableData: [],
                select_word: '',
                createGroupDialogFormVisible: false,
                createGroupForm: {
                    groupName: '',
                    groupDesc: ''
                },
                createGroupFormRules: {
                    groupName: [
                        {required: true, message: '请输入群组名称', trigger: 'blur'},
                        {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
                    ],
                    groupDesc: [
                        {required: true, message: '请填写群组简介', trigger: 'blur'},
                        {max: 100, message: '不要超过 100 个字符', trigger: 'blur'}
                    ]
                }
            }
        },
        created() {
            this.getData();
        },
        methods: {
            handleCurrentChange(val) {
                this.getData();
            },
            getData() {
                let self = this;
                //取群组列表数据到表中
                let params = {
                    username: localStorage.getItem('cp_username')
                };
                ApiUtils.getMyGroups(params).then(function (data) {
                    if (data.code === 0) {
                        self.tableData = data.data;
                    } else {
                        //失败提示
                        console.log(data.message);
                        self.$message.error('服务器出错了，加载列表数据失败');
                    }
                });
            },
            formatter(row, column) {
                //标签的格式化
                if (row.owner) {
                    return '我创建的';
                } else {
                    return '添加我的';
                }
            },
            filterTag(value, row) {
                //筛选标签
                return row.owner === value;
            },
            handleManage(index, row) {
                //管理按钮
                let groupId = row.id;
                this.$router.push({path: 'managegroup', query:{groupId: groupId}});
            },
            createGroup() {
                //添加用户组
                this.createGroupDialogFormVisible = true;
            },
            submitForm(formName) {
                const self = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.createGroupDialogFormVisible = false;
                        //创建新的群组，并刷新列表
                        let params = {
                            username: localStorage.getItem('cp_username'),
                            name: self.createGroupForm.groupName,
                            desc: self.createGroupForm.groupDesc
                        };
                        ApiUtils.createGroups(params).then(function (data) {
                            if (data.code === 0) {
                                //创建成功!
                                let successMsg = '创建群组:' + self.createGroupForm.groupName + ' 成功！';
                                self.$message.success(successMsg);
                                self.getData();//刷新数据
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
            },
            resetForm(formName) {
                this.createGroupDialogFormVisible = false;
                this.$refs[formName].resetFields();
            }
        },
        computed: {
            data() {
                const self = this;
                return self.tableData.filter(function (d) {
                    if (d.name.indexOf(self.select_word) > -1 ||
                        d.creator_name.indexOf(self.select_word) > -1 ||
                        d.desc.indexOf(self.select_word) > -1 ||
                        d.created_at.indexOf(self.select_word) > -1 ||
                        d.updated_at.indexOf(self.select_word) > -1
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
