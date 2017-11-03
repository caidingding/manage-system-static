<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-share"></i>群组管理</el-breadcrumb-item>
                <el-breadcrumb-item>加入群组</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="handle-box">
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
                width="100">
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
                width="180"
                :filters="[{ text: '我创建的', value: 0 }, { text: '已加入', value: 1 }, { text: '未加入', value: 2 }]"
                :filter-method="filterTag"
                filter-placement="bottom-end">
                <template scope="scope">
                    <el-tag
                        :type="scope.row.group_tag == 0 ? 'primary' : 'success'"
                        close-transition>{{scope.row.group_tag == 0 ? '我创建的' : scope.row.group_tag == 1 ? '已加入' : '未加入'}}
                    </el-tag>
                    <el-tag v-if="scope.row.group_tag == 3 || scope.row.group_tag == 4 "
                            :type="scope.row.owner ? 'primary' : 'danger'"
                            close-transition>{{scope.row.group_tag == 3 ? '已申请加入' : '申请被拒绝'}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button v-if="scope.row.group_tag == 2"
                               size="small"
                               type="success"
                               @click="handleApplyIn(scope.$index, scope.row)">申请加入
                    </el-button>
                    <el-button v-if="scope.row.group_tag == 3"
                               size="small"
                               type="success"
                               @click="handleCancelApplyIn(scope.$index, scope.row)">撤销加入申请
                    </el-button>
                    <el-button v-if="scope.row.group_tag == 4"
                               size="small"
                               type="success"
                               @click="handleAfreshApplyIn(scope.$index, scope.row)">重新申请加入
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import ApiUtils from '../../../../utils/ApiUtils';

    export default {
        data() {
            return {
                tableData: [],
                select_word: '',
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
                ApiUtils.getAllGroups(params).then(function (data) {
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
                if (row.group_tag == 0) {
                    return '我创建的';
                } else if (row.group_tag == 1) {
                    return '已加入';
                } else if (row.group_tag == 2) {
                    return '未加入';
                } else {
                    return '未知标签';
                }
            },
            filterTag(value, row) {
                //筛选标签
                return row.group_tag === value;
            },
            handleApplyIn(index, row) {
                let self = this;
                //申请加入按钮
                let groupId = row.id;
                let username = localStorage.getItem('cp_username');
                let apply = 1;//申请加入
                let params = {
                    groupId: groupId,
                    username: username,
                    apply: apply
                };
                ApiUtils.changeGroupApply(params).then(function (data) {
                    if (data.code === 0) {
                        //创建成功!
                        let successMsg = '已经申请加入';
                        self.$message.success(successMsg);
                        self.getData();//刷新数据
                    } else {
                        //失败提示
                        self.$message.error(data.message);
                    }
                });
            },
            handleCancelApplyIn(index, row) {
                //撤销申请
                let self = this;
                let groupId = row.id;
                let username = localStorage.getItem('cp_username');
                let apply = 3;//撤销申请
                let params = {
                    groupId: groupId,
                    username: username,
                    apply: apply
                };
                ApiUtils.changeGroupApply(params).then(function (data) {
                    if (data.code === 0) {
                        //创建成功!
                        let successMsg = '已经撤销申请';
                        self.$message.success(successMsg);
                        self.getData();//刷新数据
                    } else {
                        //失败提示
                        self.$message.error(data.message);
                    }
                });

            },
            handleAfreshApplyIn(index, row) {
                //重新申请加入
                let self = this;
                let groupId = row.id;
                let username = localStorage.getItem('cp_username');
                let apply = 1;
                let params = {
                    groupId: groupId,
                    username: username,
                    apply: apply
                };
                ApiUtils.changeGroupApply(params).then(function (data) {
                    if (data.code === 0) {
                        //创建成功!
                        let successMsg = '已经重新申请加入';
                        self.$message.success(successMsg);
                        self.getData();//刷新数据
                    } else {
                        //失败提示
                        self.$message.error(data.message);
                    }
                });
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
