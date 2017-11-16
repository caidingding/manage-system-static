<template>
    <el-container class="el-container">
        <el-aside class="el-aside" width="300px">
            <ztree id="ztreeSide"
                   :setting="ztreeSetting"
                   :data="ztreeData"
                   @onClick="nodeClick"
                   @onDrop="nodeDragDrop"
                   @onRemove="nodeRemove"
                   @onRename="nodeRename"
            ></ztree>
        </el-aside>
        <el-container>
            <el-main>
                <div>
                    <div class="crumbs">
                        <el-breadcrumb separator="/">
                            <el-breadcrumb-item><i class="el-icon-setting"></i> 自述</el-breadcrumb-item>
                        </el-breadcrumb>
                    </div>
                    <div class="ms-doc">
                        <h3>README.md</h3>
                        <article>
                            <h1>manage-system</h1>
                            <p>基于Vue.js 2.x系列 + Element UI 的后台管理系统解决方案</p>
                            <h2>前言</h2>
                            <p>
                                之前在公司用了Vue + Element组件库做了个后台管理系统，基本很多组件可以直接引用组件库的，但是也有一些需求无法满足。像图片裁剪上传、富文本编辑器、图表等这些在后台管理系统中很常见的功能，就需要引用其他的组件才能完成。从寻找组件，到使用组件的过程中，遇到了很多问题，也积累了宝贵的经验。所以我就把开发这个后台管理系统的经验，总结成这个后台管理系统解决方案。</p>
                            <p>
                                该方案作为一套多功能的后台框架模板，适用于绝大部分的后台管理系统（Web Management System）开发。基于vue.js,使用vue-cli脚手架快速生成项目目录，引用Element UI组件库，方便开发快速简洁好看的组件。分离颜色样式，支持手动切换主题色，而且很方便使用自定义主题色。</p>
                            <h2>功能</h2>
                            <el-checkbox disabled checked>Element UI</el-checkbox>
                            <br>
                            <el-checkbox disabled checked>登录/注销</el-checkbox>
                            <br>
                            <el-checkbox disabled checked>表格</el-checkbox>
                            <br>
                            <el-checkbox disabled checked>表单</el-checkbox>
                            <br>
                            <el-checkbox disabled checked>图表</el-checkbox>
                            <br>
                            <el-checkbox disabled checked>富文本编辑器</el-checkbox>
                            <br>
                            <el-checkbox disabled checked>markdown编辑器</el-checkbox>
                            <br>
                            <el-checkbox disabled checked>图片拖拽/裁剪上传</el-checkbox>
                            <br>
                            <el-checkbox disabled checked>支持切换主题色</el-checkbox>
                            <br>
                            <el-checkbox disabled checked>列表拖拽排序</el-checkbox>
                            <br>
                        </article>
                    </div>

                </div>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    import ztree from 'ztreev'
    import ApiUtils from '../../../../utils/ApiUtils';

    export default {
        components: {
            'ztree': ztree
        },
        data() {
            return {
                ztreeSetting: {
                    view: {
                        addHoverDom: this.addHoverDomMethod,
                        removeHoverDom: this.removeHoverDomMethod,
                        selectedMulti: false
                    },
                    data: {
                        simpleData: {
                            enable: true,
                            idKey: "id",
                            pIdKey: "pid",
                            rootPId: 0
                        }
                    },
                    edit: {
                        enable: true,
                        removeTitle: '删除',
                        renameTitle: '重命名',
                        drag: {
                            isCopy: false,

                        }
                    },
                    async: {
                        enable: false,
                    },
                    once: {
                        url: ApiUtils.loadNodesDataUrl,
                        type: 'POST',
                        data: {rootId: this.$route.params.rootId},
                        dataFilter: function (data) {
                            return data.data
                        }
                    }
                },
                ztreeData: [],
                newCount: 1,

            }
        },
        methods: {
            addHoverDomMethod: function (treeId, treeNode) {
                //添加按钮的监听事件
                let self = this;
                let sObj = $("#" + treeNode.tId + "_span");
                if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0) return;
                let addStr = "<span class='button add' id='addBtn_" + treeNode.tId
                    + "' title='add node' onfocus='this.blur();'></span>";
                sObj.after(addStr);
                let btn = $("#addBtn_" + treeNode.tId);
                if (btn) btn.bind("click", function () {
                    let zTree = $.fn.zTree.getZTreeObj("ztreeSide");
                    //后台保存新建的节点，并添加到树上
                    self.createNode(zTree, treeNode);
                    return false;
                });
            },

            removeHoverDomMethod: function (treeId, treeNode) {
                //删除按钮的监听事件
                $("#addBtn_" + treeNode.tId).unbind().remove();
            },
            nodeClick: function (event, treeId, treeNode, clickFlag) {
                //节点被点击的处理，拉取数据,修改URL
                console.log('点击了');

            },
            nodeDragDrop: function (event, treeId, treeNodes, targetNode, moveType, isCopy) {
                //节点被移动结束后的处理
                let self = this;
                let currentNode = treeNodes[0];
                let id = currentNode.id;
                let pid = currentNode.pid;
                let pos = currentNode.pos;
                let targetId = targetNode.id;
                let targetPid = targetNode.pid;
                let targetPos = targetNode.pos;
                let rootId = this.$route.params.rootId;
                let params = {
                    id: id,
                    pid: pid,
                    pos: pos,
                    targetId: targetId,
                    targetPid: targetPid,
                    targetPos: targetPos,
                    moveType: moveType,
                    rootId: rootId
                };
                ApiUtils.moveTreeNode(params).then(function (data) {
                    if (data.code === 0) {
                        //移动成功

                    } else {
                        //失败提示
                        console.log(data.message);
                        self.$message.error(data.message);
                    }
                });

            },
            createNode: function (zTree, treeNode) {
                //节点被创建后的处理
                let self = this;
                let rootId = self.$route.params.rootId;
                let pid = treeNode.id;
                let name = '新建内容节点';
                //取群组列表数据到表中
                let params = {
                    rootId: rootId,
                    pid: pid,
                    name: name,
                    type: 0,
                    status: 0,
                };
                ApiUtils.createTreeNode(params).then(function (data) {
                    if (data.code === 0) {
                        console.log(JSON.stringify(data.data));
                        zTree.addNodes(treeNode, data.data);
                    } else {
                        //失败提示
                        console.log(data.message);
                        self.$message.error(data.message);
                    }
                });
            },
            nodeRemove: function (event, treeId, treeNode) {
                //删除节点
                let self = this;
                let params = {
                    id: treeNode.id,
                };
                ApiUtils.deleteTreeNode(params).then(function (data) {
                    if (data.code === 0) {
                        //成功重命名

                    } else {
                        //失败提示
                        console.log(data.message);
                        self.$message.error(data.message);
                    }
                });

            },
            nodeRename: function (event, treeId, treeNode, isCancel) {
                //编辑节点名称结束后的事件
                if (!isCancel) {
                    //如果没有取消修改操作
                    let self = this;
                    let params = {
                        id: treeNode.id,
                        name: treeNode.name,
                    };
                    ApiUtils.renameTreeNode(params).then(function (data) {
                        if (data.code === 0) {
                            //成功重命名

                        } else {
                            //失败提示
                            console.log(data.message);
                            self.$message.error(data.message);
                        }
                    });

                }

            },
        },
    }
</script>

<style scoped>
    @import "~ztree/css/metroStyle/metroStyle.css";

    .el-container {
        height: auto;
        border: 1px solid #eee
    }

    .el-header {
        background-color: #B3C0D1;
        color: #333;
        line-height: 60px;
    }

    .el-aside {
        color: #333;
    }

    .ms-doc {
        width: 100%;
        max-width: 980px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    }

    .ms-doc h3 {
        padding: 9px 10px 10px;
        margin: 0;
        font-size: 14px;
        line-height: 17px;
        background-color: #f5f5f5;
        border: 1px solid #d8d8d8;
        border-bottom: 0;
        border-radius: 3px 3px 0 0;
    }

    .ms-doc article {
        padding: 45px;
        word-wrap: break-word;
        background-color: #fff;
        border: 1px solid #ddd;
        border-bottom-right-radius: 3px;
        border-bottom-left-radius: 3px;
    }

    .ms-doc article h1 {
        font-size: 32px;
        padding-bottom: 10px;
        margin-bottom: 15px;
        border-bottom: 1px solid #ddd;
    }

    .ms-doc article h2 {
        margin: 24px 0 16px;
        font-weight: 600;
        line-height: 1.25;
        padding-bottom: 7px;
        font-size: 24px;
        border-bottom: 1px solid #eee;
    }

    .ms-doc article p {
        margin-bottom: 15px;
        line-height: 1.5;
    }

    .ms-doc article .el-checkbox {
        margin-bottom: 5px;
    }


</style>
