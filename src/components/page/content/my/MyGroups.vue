<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-share"></i>群组管理</el-breadcrumb-item>
                <el-breadcrumb-item>我的群组</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="plugins-tips">
            如果需要使用群组中已配置好的各项功能，请点击下表中的<b>群组功能</b>。
        </div>
        <!-- 这里放置群组表格 -->
        <el-table
            :data="groupData"
            style="width: 100%"
            :default-sort="{prop: 'date', order: 'descending'}"
        >
            <el-table-column
                prop="id"
                label="群组ID"
                sortable
                width="180">
            </el-table-column>
            <el-table-column
                prop="name"
                label="群组名称"
                sortable
                width="180">
            </el-table-column>
            <el-table-column
                prop="creator"
                label="创建者"
                width="180">
            </el-table-column>
            <el-table-column
                label="群组功能">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="info"
                        @click="handleUse(scope.$index, scope.row)">使用功能
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
                groupData: []
            }
        },
        methods: {
            getGroupData() {
                let self = this;
                //取群组列表数据到表中
                let params = {
                    username: localStorage.getItem('cp_username')
                };
                ApiUtils.getMyGroups(params).then(function (data) {
                    if (data.code === 0) {
                        console.log(data.data);
                        let groupTableData = [];
                        for (let i = 0; i < data.data.length; i++) {
                            let groupInfo = {};
                            groupInfo.id = data.data[i].id;
                            groupInfo.name = data.data[i].name;
                            groupInfo.creator = data.data[i].creator_name;
                            groupInfo.url = '/board/' + data.data[i].id + '/';
                            groupTableData.push(groupInfo);
                        }
                        console.log(groupTableData);
                        self.groupData = groupTableData;
                    } else {
                        //失败提示
                        console.log(data.message);
                        self.$message.error('服务器出错了，加载列表数据失败');
                    }
                });
            },
            handleUse(index, row) {
                this.$router.push({path: row.url});
            }
        },
        computed: {},
        beforeMount() {
            //加载数据
            this.getGroupData()
        }
    }
</script>

