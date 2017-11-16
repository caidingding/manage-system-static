<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-share"></i>群组管理</el-breadcrumb-item>
                <el-breadcrumb-item>我的群组</el-breadcrumb-item>
                <el-breadcrumb-item>管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-row>
            <el-col :span="12">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span style="line-height: 5px;"><el-tag type="danger">群组信息</el-tag></span>
                        <el-button size="small" style="float: right;" type="primary" @click="editGroup">修改</el-button>
                    </div>
                    <div class="text item">
                        <el-row>
                            <el-col :span="8">
                                <div class="grid-content bg-purple">
                                    <el-tag type="info">群组名称:</el-tag>
                                </div>
                            </el-col>
                            <el-col :span="16">
                                <div class="grid-content bg-purple-light">
                                    <span class="msg-span">{{ groupMsg.name }}</span>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="text item">
                        <el-row>
                            <el-col :span="8">
                                <div class="grid-content bg-purple">
                                    <el-tag type="info">群组简介:</el-tag>
                                </div>
                            </el-col>
                            <el-col :span="16">
                                <div class="grid-content bg-purple-light">
                                    <span class="msg-span">{{ groupMsg.desc }}</span>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="text item">
                        <el-row>
                            <el-col :span="8">
                                <div class="grid-content bg-purple">
                                    <el-tag type="info">创建者ID:</el-tag>
                                </div>
                            </el-col>
                            <el-col :span="16">
                                <div class="grid-content bg-purple-light">
                                    <span class="msg-span">{{ groupMsg.creator_id }}</span>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="text item">
                        <el-row>
                            <el-col :span="8">
                                <div class="grid-content bg-purple">
                                    <el-tag type="info">创建者用户名:</el-tag>
                                </div>
                            </el-col>
                            <el-col :span="16">
                                <div class="grid-content bg-purple-light">
                                    <span class="msg-span">{{ groupMsg.creator_name }}</span>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="text item">
                        <el-row>
                            <el-col :span="8">
                                <div class="grid-content bg-purple">
                                    <el-tag type="info">创建时间:</el-tag>
                                </div>
                            </el-col>
                            <el-col :span="16">
                                <div class="grid-content bg-purple-light">
                                    <span class="msg-span">{{ groupMsg.created_at }}</span>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="text item">
                        <el-row>
                            <el-col :span="8">
                                <div class="grid-content bg-purple">
                                    <el-tag type="info">更新时间:</el-tag>
                                </div>
                            </el-col>
                            <el-col :span="16">
                                <div class="grid-content bg-purple-light">
                                    <span class="msg-span">{{ groupMsg.updated_at }}</span>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span style="line-height: 5px;"><el-tag type="danger">申请入组人员列表</el-tag></span>
                    </div>
                    <!-- 申请入组用户列表 -->
                    <el-col :span="24">
                        <div class="grid-content bg-purple-dark">
                            <el-table :data="applyTableData">
                                <el-table-column label="用户名">
                                    <template slot-scope="scope">
                                        <el-popover trigger="hover" placement="top">
                                            <p>邮箱: {{ scope.row.email }}</p>
                                            <p>手机号: {{ scope.row.mobile }}</p>
                                            <p>申请时间: {{ scope.row.created_at }}</p>
                                            <div slot="reference" class="name-wrapper">
                                                <el-tag size="medium">{{ scope.row.name }}</el-tag>
                                            </div>
                                        </el-popover>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作">
                                    <template slot-scope="scope">
                                        <el-button
                                            size="mini"
                                            type="success"
                                            icon="el-icon-check"
                                            @click="handleApplyPass(scope.$index, scope.row)">通过
                                        </el-button>
                                        <el-button
                                            size="mini"
                                            type="danger"
                                            icon="el-icon-close"
                                            @click="handleApplyReject(scope.$index, scope.row)">拒绝
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-col>
                </el-card>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="24">
                <el-card class="box-card-large">
                    <div slot="header" class="clearfix">
                        <span style="line-height: 5px;"><el-tag type="danger">群组成员</el-tag></span>
                        <span style="float: right;">
                            <el-select size="small" v-model="memberType" placeholder="请选择">
                                <el-option
                                    v-for="item in memberTypeOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                            <el-autocomplete class="username-autocomplete" size="small" v-model="memberName"
                                             :fetch-suggestions="memberNameQuerySearch" placeholder="要添加的用户名"
                                             :trigger-on-focus="false">
                                <template slot-scope="props">
                                    <div class="name">{{ props.item.value }}</div>
                                    <span class="email">{{ props.item.email }}</span>
                                </template>
                            </el-autocomplete>
                            <el-button size="small" type="primary" @click="addMember">
                                添加
                            </el-button>
                        </span>
                    </div>
                    <!-- 组内用户列表 -->
                    <el-col :span="24">
                        <div class="grid-content bg-purple-dark">
                            <el-table :data="membersTableData">
                                <el-table-column label="用户名">
                                    <template slot-scope="scope">
                                        <el-popover trigger="hover" placement="top">
                                            <p>邮箱: {{ scope.row.email }}</p>
                                            <p>手机号: {{ scope.row.mobile }}</p>
                                            <div slot="reference" class="name-wrapper">
                                                <el-tag size="medium">{{ scope.row.name }}</el-tag>
                                            </div>
                                        </el-popover>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="类型">
                                    <template slot-scope="scope">
                                        <i class="el-icon-time"></i>
                                        <span style="margin-left: 10px">
                                            {{ scope.row.type == 0 ? '普通用户' : '管理员'}}
                                        </span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作">
                                    <template slot-scope="scope">
                                        <el-button v-if="scope.row.type == 0"
                                                   size="mini"
                                                   type="success"
                                                   icon="el-icon-caret-top"
                                                   @click="handleMemberToManager(scope.$index, scope.row)">升级为管理员
                                        </el-button>
                                        <el-button v-if="scope.row.type == 1"
                                                   size="mini"
                                                   type="success"
                                                   icon="el-icon-caret-bottom"
                                                   @click="handleMemberToNormal(scope.$index, scope.row)">改为普通用户
                                        </el-button>
                                        <el-button
                                            size="mini"
                                            type="danger"
                                            icon="el-icon-circle-close"
                                            @click="handleMemberDel(scope.$index, scope.row)">移除
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-col>

                </el-card>
            </el-col>
        </el-row>
        <div>
            <el-dialog title="修改群组" :visible.sync="editGroupDialogFormVisible">
                <el-form :model="editGroupForm" :rules="editGroupFormRules" ref="editGroupForm"
                         label-width="100px" class="demo-ruleForm">
                    <el-form-item label="群组名称" prop="groupName">
                        <el-input v-model="editGroupForm.groupName"></el-input>
                    </el-form-item>
                    <el-form-item label="群组简介" prop="groupDesc">
                        <el-input type="textarea" v-model="editGroupForm.groupDesc"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="resetForm('editGroupForm')">取 消</el-button>
                    <el-button type="primary" @click="submitForm('editGroupForm')">确 定</el-button>
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
                groupMsg: {},
                applyTableData: [],
                membersTableData: [],
                memberName: '',
                editGroupDialogFormVisible: false,
                editGroupForm: {
                    groupName: '',
                    groupDesc: ''
                },
                editGroupFormRules: {
                    groupName: [
                        {required: true, message: '请输入群组名称', trigger: 'blur'},
                        {min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur'}
                    ],
                    groupDesc: [
                        {required: true, message: '请填写群组简介', trigger: 'blur'},
                        {max: 100, message: '不要超过 100 个字符', trigger: 'blur'}
                    ]
                },
                memberTypeOptions: [{
                    value: 0,
                    label: '普通用户'
                }, {
                    value: 1,
                    label: '管理员'
                }],
                memberType: 0
            }
        },
        created() {
            this.getGroupMsgData();
            this.getApplyData();
            this.getMembersData();
        },
        methods: {
            getGroupMsgData() {
                let self = this;
                let groupId = self.$route.query.groupId;
                //取群组列表数据到表中
                let params = {
                        username: localStorage.getItem('cp_username'),
                        groupId: groupId
                    }
                ;
                ApiUtils.getOwnedGroupInfo(params).then(function (data) {
                    if (data.code === 100) {
                        self.groupMsg = data.data;
                    } else {
                        //失败提示
                        console.log(data.message);
                        self.$message.error(data.message);
                    }
                });
            },
            editGroup() {
                //添加用户组
                this.editGroupDialogFormVisible = true;
            },
            submitForm(formName) {
                const self = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.editGroupDialogFormVisible = false;
                        //修改群组信息，并刷新列表
                        let params = {
                            username: localStorage.getItem('cp_username'),
                            id: self.groupMsg.id,
                            name: self.editGroupForm.groupName,
                            desc: self.editGroupForm.groupDesc
                        };
                        ApiUtils.editGroups(params).then(function (data) {
                            if (data.code === 100) {
                                //创建成功!
                                let successMsg = '修改群组:' + self.editGroupForm.groupName + ' 成功！';
                                self.$message.success(successMsg);
                                self.getGroupMsgData();//刷新数据
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
                this.editGroupDialogFormVisible = false;
                this.$refs[formName].resetFields();
            },
            getApplyData() {
                let self = this;
                //取申请群组列表数据到表中
                let groupId = self.$route.query.groupId;
                let params = {
                    groupId: groupId
                };
                ApiUtils.getApplyInGroupMembers(params).then(function (data) {
                    if (data.code === 100) {
                        self.applyTableData = data.data;
                    } else {
                        //失败提示
                        console.log(data.message);
                        self.$message.error(data.message);
                    }
                });
            },
            getMembersData() {
                let self = this;
                //取申请群组列表数据到表中
                let groupId = self.$route.query.groupId;
                let params = {
                    groupId: groupId
                };
                ApiUtils.getGroupMembers(params).then(function (data) {
                    if (data.code === 100) {
                        self.membersTableData = data.data;
                    } else {
                        //失败提示
                        console.log(data.message);
                        self.$message.error(data.message);
                    }
                });
            },
            handleApplyPass(index, row) {
                let self = this;
                //通过入组申请
                let groupId = row.group_id;
                let userId = row.user_id;
                let apply = 0;
                let params = {
                    groupId: groupId,
                    userId: userId,
                    apply: apply
                };
                ApiUtils.changeGroupMembersApply(params).then(function (data) {
                    if (data.code === 100) {
                        //创建成功!
                        let successMsg = '已通过';
                        self.$message.success(successMsg);
                        self.getApplyData();//刷新数据
                        self.getMembersData();
                    } else {
                        //失败提示
                        self.$message.error(data.message);
                    }
                });

            },
            handleApplyReject(index, row) {
                let self = this;
                //拒绝入组申请
                let groupId = row.group_id;
                let userId = row.user_id;
                let apply = 2;
                let params = {
                    groupId: groupId,
                    userId: userId,
                    apply: apply
                };
                ApiUtils.changeGroupMembersApply(params).then(function (data) {
                    if (data.code === 100) {
                        //创建成功!
                        let successMsg = '已拒绝';
                        self.$message.success(successMsg);
                        self.getApplyData();//刷新数据
                    } else {
                        //失败提示
                        self.$message.error(data.message);
                    }
                });

            },
            memberNameQuerySearch(queryString, cb) {
                //如果有输入的话，则通过后台匹配匹配返回可能的用户名
                let results = [];
                if (queryString) {
                    let params = {
                        name: queryString
                    };
                    ApiUtils.queryUserName(params).then(function (data) {
                        if (data.code === 100) {
                            //查找到数据了
                            results = data.data;
                            // 调用 callback 返回建议列表的数据
                            cb(results);
                        } else {
                            //失败提示
                            self.$message.error(data.message);
                            // 调用 callback 返回建议列表的数据
                            cb(results);
                        }
                    });
                }

            },
            addMember() {
                //添加用户到组内
                let self = this;
                let params = {
                    groupId: self.$route.query.groupId,
                    username: self.memberName,
                    userType: self.memberType
                };
                ApiUtils.AddMemberToGroup(params).then(function (data) {
                    if (data.code === 100) {
                        //添加成功，提示并刷新组成员表
                        self.$message.success('添加成员成功');
                        self.getMembersData();
                    } else {
                        //失败提示
                        self.$message.error(data.message);
                    }
                });
            },
            handleMemberDel(index, row) {
                //从组里移除用户
                //添加用户到组内
                let self = this;
                let params = {
                    groupId: self.$route.query.groupId,
                    username: row.name,
                };
                ApiUtils.delMemberFromGroup(params).then(function (data) {
                    if (data.code === 100) {
                        //移除成功，提示并刷新组成员表
                        self.$message.success('移除成员成功');
                        self.getMembersData();
                    } else {
                        //失败提示
                        self.$message.error(data.message);
                    }
                });
            },
            handleMemberToManager(index, row) {
                //用户改为管理员
                let self = this;
                let params = {
                    groupId: self.$route.query.groupId,
                    username: row.name,
                    userType: 1
                };
                ApiUtils.changeGroupMemberType(params).then(function (data) {
                    if (data.code === 100) {
                        //移除成功，提示并刷新组成员表
                        self.$message.success('升级成功');
                        self.getMembersData();
                    } else {
                        //失败提示
                        self.$message.error(data.message);
                    }
                });

            },
            handleMemberToNormal(index, row) {
                //用户改为普通用户
                let self = this;
                let params = {
                    groupId: self.$route.query.groupId,
                    username: row.name,
                    userType: 0
                };
                ApiUtils.changeGroupMemberType(params).then(function (data) {
                    if (data.code === 100) {
                        //移除成功，提示并刷新组成员表
                        self.$message.success('更改成功');
                        self.getMembersData();
                    } else {
                        //失败提示
                        self.$message.error(data.message);
                    }
                });
            }

        },
        watch: {
            editGroupDialogFormVisible: function (value) {
                if (value) {
                    this.editGroupForm.groupName = this.groupMsg.name;
                    this.editGroupForm.groupDesc = this.groupMsg.desc;
                }
            }
        }
    }
</script>

<style>
    .text {
        font-size: 10px;
    }

    .item {
        padding: 3px 0;
    }

    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }

    .clearfix:after {
        clear: both
    }

    .box-card {
        width: 500px;
    }

    .msg-span {
        background: cornsilk;
        line-height: 30px
    }

    .username-autocomplete {
        width: 300px;
        display: inline-block;
    }

    .username-autocomplete li {
        line-height: normal;
        padding: 3px;
    }

    .name {
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .email {
        font-size: 12px;
        color: #b4b4b4;
    }

    .highlighted .addr {
        color: #ddd;
    }

</style>
