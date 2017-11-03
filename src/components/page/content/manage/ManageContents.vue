<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-document"></i>内容管理</el-breadcrumb-item>
                <el-breadcrumb-item>我的内容</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
            <el-button type="primary" icon="plus" class="mr10" @click="createContent">创建内容</el-button>
            <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10" icon="search"></el-input>
        </div>
        <el-table :data="data" border style="width: 100%" ref="multipleTable">
            <el-table-column
                label="内容名称"
                fixed='left'
                width="180">
                <template scope="scope">
                    <el-popover trigger="hover" placement="top">
                        <p>内容ID: {{ scope.row.id }}</p>
                        <p>简介: {{ scope.row.desc }}</p>
                        <div slot="reference" class="name-wrapper">
                            <el-tag>{{ scope.row.name }}</el-tag>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                label="是否私有"
                width="120">
                <template scope="scope">
                    <p>{{ scope.row.is_private == 1 ? '私有内容' : '公开内容' }}</p>
                </template>
            </el-table-column>
            <el-table-column
                label="所属群组"
                width="120">
                <template scope="scope">
                    <p>{{ scope.row.group_name }}</p>
                </template>
            </el-table-column>
            <el-table-column
                label="创建者"
                width="120">
                <template scope="scope">
                    <el-popover trigger="hover" placement="top">
                        <p>ID: {{ scope.row.creator_id }}</p>
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
                :filters="[{ text: '群组内容', value: 1 }, { text: '个人内容', value: 0 }]"
                :filter-method="filterTag"
                filter-placement="bottom-end">
                <template scope="scope">
                    <el-tag
                        :type="scope.row.type == 0 ? 'primary' : 'success'"
                        close-transition>{{scope.row.type == 0 ? '个人内容' : '群组内容'}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" fixed='right'>
                <template scope="scope">
                    <el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div>
            <el-dialog title="创建内容" :visible.sync="createContentDialogFormVisible">
                <el-form :model="createContentForm" :rules="createContentFormRules" ref="createContentForm"
                         label-width="100px">
                    <el-row>
                        <el-col :span="10">
                            <div class="grid-content bg-purple">
                                <el-form-item label="内容空间" prop="contentOwner">
                                    <el-select v-model="createContentForm.contentOwner"
                                               placeholder="请选择">
                                        <el-option-group
                                            v-for="group in contentOptions"
                                            :key="group.label"
                                            :label="group.label">
                                            <el-option
                                                v-for="item in group.options"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                            </el-option>
                                        </el-option-group>
                                    </el-select>
                                </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="14">
                            <div class="grid-content bg-purple-light">
                                <el-form-item label="内容名称" prop="contentName">
                                    <el-input v-model="createContentForm.contentName"></el-input>
                                </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="16">
                            <div class="grid-content bg-purple-light">
                                <el-form-item label="是否私有" prop="contentIsPrivate">
                                    <div>
                                        <el-radio v-model="createContentForm.contentIsPrivate" label="0" border>公开内容
                                        </el-radio>
                                        <el-radio v-model="createContentForm.contentIsPrivate" label="1" border>私有内容
                                        </el-radio>
                                    </div>
                                </el-form-item>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="内容简介" prop="contentDesc">
                                <el-input type="textarea" v-model="createContentForm.contentDesc"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="resetForm('createContentForm')">取 消</el-button>
                    <el-button type="primary" @click="submitForm('createContentForm')">确 定</el-button>
                </div>
            </el-dialog>
            <el-dialog title="编辑内容" :visible.sync="editContentDialogFormVisible">
                <el-form :model="editContentForm" :rules="editContentFormRules" ref="editContentForm"
                         label-width="100px">
                    <el-row>
                        <el-col :span="10">
                            <div class="grid-content bg-purple">
                                <el-form-item label="内容空间" prop="contentOwner">
                                    <el-select v-model="editContentForm.contentOwner"
                                               placeholder="请选择">
                                        <el-option-group
                                            v-for="group in contentOptions"
                                            :key="group.label"
                                            :label="group.label">
                                            <el-option
                                                v-for="item in group.options"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                            </el-option>
                                        </el-option-group>
                                    </el-select>
                                </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="14">
                            <div class="grid-content bg-purple-light">
                                <el-form-item label="内容名称" prop="contentName">
                                    <el-input v-model="editContentForm.contentName"></el-input>
                                </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="16">
                            <div class="grid-content bg-purple-light">
                                <el-form-item label="是否私有" prop="contentIsPrivate">
                                    <div>
                                        <el-radio v-model="editContentForm.contentIsPrivate" label="0" border>公开内容
                                        </el-radio>
                                        <el-radio v-model="editContentForm.contentIsPrivate" label="1" border>私有内容
                                        </el-radio>
                                    </div>
                                </el-form-item>
                            </div>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="内容简介" prop="contentDesc">
                                <el-input type="textarea" v-model="editContentForm.contentDesc"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="resetForm('editContentForm')">取 消</el-button>
                    <el-button type="primary" @click="submitForm('editContentForm')">确 定</el-button>
                </div>
            </el-dialog>

        </div>
    </div>
</template>

<script>
    import ApiUtils from '../../../../utils/ApiUtils';

    export default {
        data() {
            const validateOwnerSelectCreateForm = (rule, value, callback) => {
                if (value === '' || this.createContentForm.contentOwner === '') {
                    callback(new Error('请选择群组'));
                }
            };
            const validateOwnerSelectEditForm = (rule, value, callback) => {
                if (value === '' || this.editContentForm.contentOwner === '') {
                    callback(new Error('请选择群组'));
                }
            };
            return {
                tableData: [],
                select_word: '',
                createContentDialogFormVisible: false,
                editContentDialogFormVisible: false,
                createContentForm: {
                    contentOwner: '',//id
                    ownerName: '',//name
                    contentName: '',
                    contentIsPrivate: '0',
                    contentDesc: ''
                },
                createContentFormRules: {
                    contentOwner: [
                        {validator: validateOwnerSelectCreateForm, trigger: 'change'}
                    ],
                    contentName: [
                        {required: true, message: '请输入内容名称', trigger: 'blur'},
                        {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
                    ],
                    contentDesc: [
                        {required: true, message: '请填写内容简介', trigger: 'blur'},
                        {max: 100, message: '不要超过 100 个字符', trigger: 'blur'}
                    ]
                },
                editContentForm: {
                    contentId: '',
                    contentOwner: '',//id
                    ownerName: '',//name
                    contentName: '',
                    contentIsPrivate: '0',
                    contentDesc: ''
                },
                editContentFormRules: {
                    contentOwner: [
                        {validator: validateOwnerSelectEditForm, trigger: 'change'}
                    ],
                    contentName: [
                        {required: true, message: '请输入内容名称', trigger: 'blur'},
                        {min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur'}
                    ],
                    contentDesc: [
                        {required: true, message: '请填写内容简介', trigger: 'blur'},
                        {max: 100, message: '不要超过 100 个字符', trigger: 'blur'}
                    ]
                },
                myGroups: [],
                myManageGroups: [],
                contentOptions: [{
                    label: '请选择群组',
                    options: []
                }],
            }
        },
        created() {
            this.getMyGroups();
        },
        methods: {
            handleCurrentChange(val) {
                this.getData();
            },
            getData(groups) {
                //取内容列表数据到表中
                let self = this;

                if (groups == null) {
                    groups = self.myGroups;
                }

                let groupIds = '';//自己的所有能管理的群组
                //获取自己有管理员权限的所有群组id
                for (let i = 0; i < groups.length; i++) {
                    if (i === 0) {
                        groupIds += groups[i].id;
                    } else {
                        groupIds += ',' + groups[i].id;
                    }
                }
                let params = {
                    groupIds: groupIds
                };
                ApiUtils.getMyTreeRootsByGroupIds(params).then(function (data) {
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
                return row.type === value;
            },
            handleEdit(index, row) {
                //编辑按钮
                this.editContentForm.contentId = row.id;
                this.editContentForm.contentOwner = row.owner_id;
                this.editContentForm.ownerName = row.group_name;
                this.editContentForm.contentName = row.name;
//                this.editContentForm.contentIsPrivate = row.is_private;
                this.editContentForm.contentDesc = row.desc;

                this.editContentDialogFormVisible = true;
            },
            createContent() {
                //添加内容
                this.createContentDialogFormVisible = true;
            },
            submitForm(formName) {
                const self = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (formName == 'createContentForm') {
                            this.createContentDialogFormVisible = false;
                            //创建新的内容，并刷新列表
                            let params = {
                                name: self.createContentForm.contentName,
                                type: 1,
                                isPrivate: self.createContentForm.contentIsPrivate,
                                desc: self.createContentForm.contentDesc,
                                creatorId: localStorage.getItem('cp_uid'),
                                creatorName: localStorage.getItem('cp_username'),
                                ownerId: self.createContentForm.contentOwner,
                                ownerName: self.createContentForm.ownerName,
                            };
                            ApiUtils.createContentTreeRoot(params).then(function (data) {
                                if (data.code === 0) {
                                    //创建成功!
                                    let successMsg = '创建内容:' + self.createContentForm.contentName + ' 成功！';
                                    self.$message.success(successMsg);
                                    self.getData();//刷新数据
                                } else {
                                    //失败提示
                                    self.$message.error(data.message);
                                }
                            });
                        } else if (formName == 'editContentForm') {
                            this.editContentDialogFormVisible = false;
                            //修改内容，并刷新列表
                            let params = {
                                id: self.editContentForm.contentId,
                                name: self.editContentForm.contentName,
                                type: 1,
                                isPrivate: self.editContentForm.contentIsPrivate,
                                desc: self.editContentForm.contentDesc,
                                creatorId: localStorage.getItem('cp_uid'),
                                creatorName: localStorage.getItem('cp_username'),
                                ownerId: self.editContentForm.contentOwner,
                                ownerName: self.editContentForm.ownerName,
                            };
                            ApiUtils.editContentTreeRoot(params).then(function (data) {
                                if (data.code === 0) {
                                    //修改成功!
                                    let successMsg = '修改内容:' + self.editContentForm.contentName + ' 成功！';
                                    self.$message.success(successMsg);
                                    self.getData();//刷新数据
                                } else {
                                    //失败提示
                                    self.$message.error(data.message);
                                }
                            });
                        }

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                if (formName == 'createContentForm') {
                    this.createContentDialogFormVisible = false;
                    this.$refs[formName].resetFields();
                } else if (formName == 'editContentForm') {
                    this.editContentDialogFormVisible = false;
                    this.$refs[formName].resetFields();
                }
            },
            getMyGroups() {
                let self = this;
                //获取自己的群组，包含自己创建的还有包含自己的
                let params = {
                    username: localStorage.getItem('cp_username'),
                };
                ApiUtils.getMyGroups(params).then(function (data) {
                    if (data.code === 0) {
                        //查询成功,筛选出有管理员权限的群组
                        self.myGroups = data.data;
                        //初始化下拉菜单的群组内容
                        let myManageGroupsOptions = [];
                        for (let i = 0; i < data.data.length; i++) {
                            if (data.data[i].member_type == 1) {
                                self.myManageGroups.push(data.data[i]);

                                let myManageGroupsOption = {};
                                myManageGroupsOption.value = data.data[i].id;
                                myManageGroupsOption.label = data.data[i].name;
                                myManageGroupsOptions.push(myManageGroupsOption);
                            }
                        }
                        self.contentOptions[0].options = myManageGroupsOptions;
                        if (myManageGroupsOptions.length == 0) {
                            //提示创建内容前先选择群组
                            self.$message.error('若要创建内容，请先创建或加入群组');
                        }

                        //接着查询获取我的内容表格数据
                        self.getData(data.data);

                    } else {
                        //失败提示
                        self.$message.error(data.message);
                    }
                });
            }
        },
        computed: {
            data: function () {
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
            },
            contentOwner: function () {
                return this.createContentForm.contentOwner
            },
            contentOwnerEdit: function () {
                return this.editContentForm.contentOwner
            }
        },
        watch: {
            contentOwner: function (val) {
                let ownerId = val;
                let contentOptions = this.contentOptions[0].options;
                for (let i = 0; i < contentOptions.length; i++) {
                    if (contentOptions[i].value == ownerId) {
                        this.createContentForm.ownerName = contentOptions[i].label;
                    }
                }
            },
            contentOwnerEdit: function (val) {
                let ownerId = val;
                let contentOptions = this.contentOptions[0].options;
                for (let i = 0; i < contentOptions.length; i++) {
                    if (contentOptions[i].value == ownerId) {
                        this.editContentForm.ownerName = contentOptions[i].label;
                    }
                }
            }
        }
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
