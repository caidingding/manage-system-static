<template>
    <el-container class="el-container">
        <el-aside class="el-aside" width="300px">
            <ztree id="ztreeSide"
                   ref="ztreeSide"
                   :setting="ztreeSetting"
                   :data="ztreeData"
                   @onClick="nodeClick"
                   @onDrop="nodeDragDrop"
                   @beforeRename="beforeNodeRename"
                   @beforeRemove="beforeNodeRemove"
                   @onRemove="nodeRemove"
                   @onRename="nodeRename"
            ></ztree>
        </el-aside>
        <el-container>
            <el-main>
                <div>
                    <div class="crumbs">
                        <el-breadcrumb separator="/">
                            <el-breadcrumb-item><i class="el-icon-setting"></i>{{ currentNodeName }}
                            </el-breadcrumb-item>
                        </el-breadcrumb>
                    </div>
                    <div v-for="(docObject, index) in docObjects" :key="index">
                        <el-card class="doc-markdown-show-card" :key="index + '_' + 1"
                                 v-if="docObject != null && docObject.type == 0 && docObject.edit == false">
                            <!-- 用来展示markDown文档的card -->
                            <el-col :span="18">
                            <span class="title-show">
                                <!-- 放置标题 -->
                                 <input autocomplete="off" type="text" rows="2" validateevent="true"
                                        class="input-md-title"
                                        v-model="docObject.title"
                                        disabled>
                            </span>
                            </el-col>
                            <el-col :span="6" align="right">
                                <el-button-group>
                                    <el-button type="info" plain icon="el-icon-edit" round
                                               @click="editDoc(index)"
                                               v-bind:disabled="manageDisabled"></el-button>
                                    <el-button type="danger" plain icon="el-icon-delete" round
                                               @click="deleteDoc(index)"
                                               v-bind:disabled="manageDisabled"></el-button>
                                </el-button-group>
                            </el-col>
                            <el-col :span="24">
                                <hr class="hr-editor"/>
                            </el-col>
                            <el-col :span="24">
                                <div class="editor-card-below">
                                    <!-- 用来显示md的组件 -->
                                    <mavon-editor style="height: 100%"
                                                  :subfield="false"
                                                  :default_open="mdDefaultOpen"
                                                  :editable="false"
                                                  :toolbarsFlag="false"
                                                  v-model="docObject.body"></mavon-editor>
                                </div>
                            </el-col>
                        </el-card>
                        <el-card class="doc-markdown-edit-card" :key="index + '_' + 2"
                                 v-if="docObject != null && docObject.type == 0 && docObject.edit == true">
                            <!-- 用来编辑markDown文档的card -->
                            <el-col :span="18">
                                <input autocomplete="off" type="text" rows="2" validateevent="true"
                                       class="input-md-title"
                                       v-model="docObject.title"
                                       placeholder="请输入标题">
                            </el-col>
                            <el-col :span="6" align="right">
                                <el-button-group>
                                    <el-button type="primary" plain icon="el-icon-document" round
                                               @click="saveDoc(index,0)"
                                               v-bind:disabled="manageDisabled"></el-button>
                                    <el-button type="danger" plain icon="el-icon-delete" round
                                               @click="deleteDoc(index)"
                                               v-bind:disabled="manageDisabled"></el-button>
                                </el-button-group>
                            </el-col>
                            <el-col :span="24">
                                <hr class="hr-editor"/>
                            </el-col>
                            <el-col :span="24">
                                <div class="editor-card-below">
                                    <mavon-editor ref="mavoneditor" style="height: 100%"
                                                  :toolbars="mdEditToolbars"
                                                  v-model="docObject.body" @imgAdd="mavonMarkdownImgAdd"></mavon-editor>
                                </div>
                            </el-col>
                        </el-card>
                        <el-card class="doc-richtext-show-card" :key="index + '_' + 3"
                                 v-if="docObject != null && docObject.type == 1 && docObject.edit == false">
                            <!-- 用来展示富文本编辑器的card -->
                            <el-col :span="18">
                            <span class="title-show">
                                <!-- 放置标题 -->
                                 <input autocomplete="off" type="text" rows="2" validateevent="true"
                                        class="input-md-title"
                                        v-model="docObject.title"
                                        disabled>
                            </span>
                            </el-col>
                            <el-col :span="6" align="right">
                                <el-button-group>
                                    <el-button type="info" plain icon="el-icon-edit" round
                                               @click="editDoc(index)"
                                               v-bind:disabled="manageDisabled"></el-button>
                                    <el-button type="danger" plain icon="el-icon-delete" round
                                               @click="deleteDoc(index)"
                                               v-bind:disabled="manageDisabled"></el-button>
                                </el-button-group>
                            </el-col>
                            <el-col :span="24">
                                <hr class="hr-editor"/>
                            </el-col>
                            <el-col :span="24">
                                <div class="editor-card-below">
                                    <!-- 用来显示富文本编辑器结果的组件 -->
                                    <span v-html="docObject.body"></span>
                                </div>
                            </el-col>
                        </el-card>
                        <el-card class="doc-richtext-edit-card" :key="index + '_' + 4"
                                 v-if="docObject != null && docObject.type == 1 && docObject.edit == true">
                            <el-col :span="18">
                                <input autocomplete="off" type="text" rows="2" validateevent="true"
                                       class="input-rt-title"
                                       v-model="docObject.title"
                                       placeholder="请输入标题">
                            </el-col>
                            <el-col :span="6" align="right">
                                <el-button-group>
                                    <el-button type="primary" plain icon="el-icon-document" round
                                               @click="saveDoc(index,1)"
                                               v-bind:disabled="manageDisabled"></el-button>
                                    <el-button type="danger" plain icon="el-icon-delete" round
                                               @click="deleteDoc(index)"
                                               v-bind:disabled="manageDisabled"></el-button>
                                </el-button-group>
                            </el-col>
                            <el-col :span="24">
                                <hr class="hr-editor"/>
                            </el-col>
                            <el-col :span="24">
                                <div class="editor-card-below">
                                    <froala style="height: 100%" :tag="'textarea'"
                                            :config="richTextEditorConfig" v-model="docObject.body"></froala>
                                </div>
                            </el-col>
                        </el-card>
                    </div>
                    <el-card class="attachments-show-card" v-if=" attachmentsData.length != 0">
                        <!-- 用来展示附件的面板 -->
                        <el-table
                            :data="attachmentsData"
                            style="width: 100%">
                            <el-table-column
                                prop="title"
                                label="附件">
                            </el-table-column>
                            <el-table-column
                                prop="size"
                                label="大小"
                                width="100">
                            </el-table-column>
                            <el-table-column
                                label="操作"
                                width="200">
                                <template slot-scope="scope">
                                    <el-button
                                        size="mini"
                                        type="primary"
                                        @click="handleDownloadAttachment(scope.$index, scope.row)">
                                        下载
                                        <i class="el-icon-download el-icon--right"></i>
                                    </el-button>
                                    <el-button
                                        size="mini"
                                        type="danger"
                                        v-bind:disabled="deleteAttachmentDisabled"
                                        @click="handleDeleteAttachment(scope.$index, scope.row)">
                                        删除
                                        <i class="el-icon-delete el-icon--right"></i>
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-card>
                    <el-card class="add-doc-card" v-show="currentNodeId">
                        <el-button type="primary" icon="el-icon-document" plain @click="addMarkDownDoc"
                                   v-bind:disabled="manageDisabled">
                            添加文章(Markdown)
                        </el-button>
                        <el-button type="info" icon="el-icon-document" plain @click="addRichTextDoc"
                                   v-bind:disabled="manageDisabled">
                            添加文章(富文本)
                        </el-button>
                        <el-button type="success" plain @click="addDocAttachment"
                                   v-bind:disabled="manageDisabled">
                            添加附件<i class="el-icon-upload el-icon--right"></i>
                        </el-button>
                    </el-card>
                </div>
                <el-dialog
                    title="上传附件"
                    :visible.sync="uploadDialogVisible"
                    width="30%">
                    <span>
                        <el-upload
                            ref="upload"
                            drag
                            :data="fileUploadData"
                            :action="fileUploadUrl"
                            :on-success="handleAttachmentUploadSuccess"
                            :before-upload="beforeAttachmentUpload"
                            multiple>
                                <i class="el-icon-upload"></i>
                                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                                <div class="el-upload__tip" slot="tip">上传的文件不要超过50M</div>
                        </el-upload>
                    </span>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="uploadDialogVisible = false">关 闭</el-button>
                    </span>
                </el-dialog>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    import ztree from 'ztreev'
    import ApiUtils from '../../../../utils/ApiUtils';
    import {mavonEditor} from 'mavon-editor'
    import 'mavon-editor/dist/css/index.css'
    import VueFroala from 'vue-froala-wysiwyg';


    export default {
        components: {
            'ztree': ztree,
            'mavon-editor': mavonEditor,
        },
        data() {
            let self = this;
            return {
                mdDefaultOpen: 'preview',
                currentNodeName: '',
                currentNodeId: '',
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
                        },
                    }
                },
                ztreeData: [],
                newCount: 1,
                mdEditToolbars: {
                    bold: true, // 粗体
                    italic: true, // 斜体
                    header: true, // 标题
                    underline: true, // 下划线
                    strikethrough: true, // 中划线
                    mark: true, // 标记
                    superscript: true, // 上角标
                    subscript: true, // 下角标
                    quote: true, // 引用
                    ol: true, // 有序列表
                    ul: true, // 无序列表
                    link: true, // 链接
                    imagelink: true, // 图片链接
                    code: true, // code
                    table: true, // 表格
                    fullscreen: true, // 全屏编辑
                    readmodel: true, // 沉浸式阅读
                    htmlcode: true, // 展示html源码
                    help: true, // 帮助
                    /* 1.3.5 */
                    undo: true, // 上一步
                    redo: true, // 下一步
                    trash: true, // 清空
                    /* 1.4.2 */
                    navigation: true, // 导航目录
                    /* 2.1.8 */
                    alignleft: true, // 左对齐
                    aligncenter: true, // 居中
                    alignright: true, // 右对齐
                    /* 2.2.1 */
                    subfield: true, // 单双栏模式
                    preview: true, // 预览
                },
                richTextEditorConfig: {
                    language: "zh_cn",
                    events: {
                        'froalaEditor.initialized': function () {
                            console.log('initialized')
                        }
                    },
                    heightMin: 300,
                    heightMax: 900,
                    imageUploadURL: ApiUtils.froalaImageUploadURL
                },
                docObjects: [],
                manageDisabled: true,
                deleteAttachmentDisabled: false,
                uploadDialogVisible: false,
                fileUploadUrl: ApiUtils.treeFileUploadUrl,
                attachmentsData: []
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
                //节点被点击的处理，修改URL,拉取数据
                let self = this;
                this.currentNodeName = treeNode.name;
                let nodeId = treeNode.id;
                let newPath = this.$route.path + '?nodeid=' + nodeId;
                this.$router.replace(newPath);

                self.currentNodeId = treeNode.id;//将当前的nodeId赋值给一个变量
                self.loadTreeNodeObjects(nodeId);
                self.loadAttachmentsData(nodeId);

                //清除组件的缓存的文件列表
                let upload = this.$refs.upload;
                upload.clearFiles();

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
                    if (data.code === 100) {
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
                    if (data.code === 100) {
                        console.log(JSON.stringify(data.data));
                        zTree.addNodes(treeNode, data.data);
                    } else {
                        //失败提示
                        console.log(data.message);
                        self.$message.error(data.message);
                    }
                });
            },
            beforeNodeRename: function (treeId, treeNode, newName, isCancel, store) {
                if (newName.length == 0) {
                    this.$message.error('节点名称不能为空');
                    store.cancel = true;
                } else {
                    store.cancel = false;
                }
            },
            beforeNodeRemove: function (treeId, treeNode, store) {
                if (treeNode.pid == 0) {
                    store.cancel = true;
                    alert('根节点不能删除');
                } else {
                    store.cancel = !confirm("确认删除 节点 -- " + treeNode.name + " 吗？");
                }
            },
            nodeRemove: function (event, treeId, treeNode) {
                //删除节点
                let self = this;
                let params = {
                    id: treeNode.id,
                };
                ApiUtils.deleteTreeNode(params).then(function (data) {
                    if (data.code === 100) {
                        //成功删除
                        self.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
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
                        if (data.code === 100) {
                            //成功重命名

                        } else {
                            //失败提示
                            console.log(data.message);
                            self.$message.error(data.message);
                        }
                    });

                }

            },
            addMarkDownDoc() {
                //添加markdown类型的文章
                let markDownDoc = this.getNewTreeObject(0);
                this.docObjects.push(markDownDoc);
            },
            addRichTextDoc() {
                //添加富文本类型的文章
                let markDownDoc = this.getNewTreeObject(1);
                this.docObjects.push(markDownDoc);

            },
            addDocAttachment() {
                //添加文章附件
                this.uploadDialogVisible = true;

            },
            getNewTreeObject(type) {
                type = type === null ? 0 : type;
                let self = this;
                return {
                    'id': null,
                    'object_id': 0,
                    'type': type,
                    'title': '',
                    'body': '',
                    'latest': 0,
                    'readonly': 0,
                    'edit': true,
                    'node_id': self.currentNodeId,
                };
            },
            editDoc(index) {
                this.docObjects[index].edit = true;
            },
            saveDoc(index, type) {
                //type 0->markDown 1->richText
                let self = this;
                let docObject = self.docObjects[index];
                let title = docObject.title;
                let body = docObject.body;

                if (title == null || title.length == 0) {
                    self.$message.error('标题不能为空');
                    return;
                }
                if (body == null || body.length == 0) {
                    self.$message.error('内容不能为空');
                    return;
                }

                //保存内容
                let params = {
                    type: type,
                    title: title,
                    body: body,
                    creatorUid: localStorage.getItem('cp_uid'),
                    readonly: 0,
                    nodeId: docObject.node_id,
                    objectId: docObject.object_id,
                };
              
                ApiUtils.saveTreeObject(params).then(function (data) {
                    if (data.code === 100) {
                        //保存成功
                        let objectData = data.data;
                        objectData.edit = false;//改为显示模式
                        objectData.node_id = self.currentNodeId;
                        self.docObjects.splice(index, 1, objectData);
                        self.$message({
                            type: 'success',
                            message: '保存成功!'
                        });
                    } else {
                        //失败提示
                        self.$message.error(data.message);
                    }
                });


            },
            deleteDoc(index) {
                let self = this;
                this.$confirm('此操作将永久删除该内容, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    //开始执行删除
                    if (self.docObjects[index].id == null) {
                        //尚未编辑完的文档
                        console.log('index:' + index);
                        self.docObjects.splice(index, 1, null);
                        self.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    } else {
                        //已经在数据库中的文档
                        let params = {
                            nodeId: self.docObjects[index].node_id,
                            objectId: self.docObjects[index].object_id,
                        };
                        ApiUtils.deleteTreeObject(params).then(function (data) {
                            if (data.code === 100) {
                                //删除成功
                                self.docObjects.splice(index, 1, null);
                                self.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                            } else {
                                //失败提示
                                self.$message.error(data.message);
                            }
                        });

                    }

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            checkLoadQueryParams() {
                //检查加载时候的参数,并做处理，展开菜单节点，加载数据。(需在左侧菜单结点全部加载完毕后才能执行)
                let self = this;
                let gid = self.$route.params.gid;//群组ID，如果当前用户不在群组内，则禁用各种操作按钮
                let nodeId = self.$route.query.nodeid;
                if (nodeId != null) {
                    let rootId = self.$route.params.rootId;
                    //展开节点

//                    let zTree = self.$refs.ztreeSide;
//                    let targetNode = zTree.action('getNodeByParam', 'id', nodeId, null);
//                    zTree.action('expandNode', targetNode, true, true, true);
//                    self.currentNodeName = targetNode.name;

                    //加载数据
                    self.currentNodeId = nodeId;
                    self.loadTreeNodeObjects(nodeId);
                    self.loadAttachmentsData();

                }
                //根据用户信息判断是否在组内，如果是组内用户的话，设置为可编辑
                let params = {
                    groupId: gid,
                    userId: localStorage.getItem('cp_uid')
                };
                ApiUtils.checkGroupRight(params).then(function (data) {
                    if (data.code === 100) {
                        //获取校验结果成功
                        let type = data.data;
                        //普通用户为0，管理员为1，都有编辑权限
                        if (type in [0, 1]) {
                            //有权限
                            self.manageDisabled = false;//启用编辑
                        } else {
                            //没权限
                            self.deleteAttachmentDisabled = true;//禁止删除附件
                            //把左侧栏的菜单编辑关掉
//                            let zTree = self.$refs.ztreeSide;
//                            zTree.action('setEditable', false);
                        }

                    } else {
                        //失败提示
                        console.log(data.message);
                        self.$message.error(data.message);
                    }
                });

            },
            beforeAttachmentUpload(file) {
                const isLt50M = file.size / 1024 / 1024 < 50;
                if (!isLt50M) {
                    this.$message.error('上传附件大小不能超过 50MB!');
                }
                return isLt50M;
            },
            handleAttachmentUploadSuccess(res, file) {
                //附件上传成功
                console.log(res);
                this.loadAttachmentsData();
            },
            loadAttachmentsData(nodeId) {
                //加载附件数据信息
                let self = this;
                let params = {
                    nodeId: nodeId == null ? self.$route.query.nodeid : nodeId
                };
                ApiUtils.getTreeAttachments(params).then(function (data) {
                    if (data.code === 100) {
                        self.attachmentsData = data.data;
                    } else {
                        //失败提示
                        console.log(data.message);
                        self.$message.error(data.message);
                    }
                });

            },
            loadTreeNodeObjects(nodeId) {
                //获取树的节点列表,只获取markdown和富文本两种
                let self = this;
                let params = {
                    nodeId: nodeId == null ? self.$route.query.nodeid : nodeId
                };
                ApiUtils.getSortedTreeObjects(params).then(function (data) {
                    if (data.code === 100) {
                        //获取成功,在结果对象添加false的edit标记
                        data.data.forEach(function (currentValue, index, arr) {
                            currentValue.edit = false;
                        });
                        self.docObjects = data.data;
                    } else {
                        //失败提示
                        console.log(data.message);
                        self.$message.error(data.message);
                    }
                });
            },
            handleDownloadAttachment(index, row) {
                //下载附件
                window.open(row.body);
            },
            handleDeleteAttachment(index, row) {
                //删除附件
                let self = this;
                this.$confirm('此操作将永久删除该内容, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    //开始执行删除
                    let params = {
                        nodeId: row.node_id,
                        objectId: row.object_id,
                    };
                    ApiUtils.deleteTreeObject(params).then(function (data) {
                        if (data.code === 100) {
                            //删除成功
                            self.loadAttachmentsData();
                            self.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        } else {
                            //失败提示
                            self.$message.error(data.message);
                        }
                    });

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
                //结束
            },
            mavonMarkdownImgAdd(filename, imgfile) {
                //mavon markdown编辑器的图片添加事件处理
                let self = this;

                let formdata = new FormData();
                formdata.append('file', imgfile);
                ApiUtils.uploadMavonMarkDownImage(formdata).then(function (data) {
                    if (data.code === 100) {
                        //上传成功，替换image
                        let mavoneditorIndex = self.$refs['mavoneditor'].length - 1;
                        self.$refs['mavoneditor'][mavoneditorIndex].$img2Url(filename, data.data);
                    } else {
                        //失败提示
                        self.$message.error(data.message);
                    }
                });

            }
        },
        mounted: function () {
            this.checkLoadQueryParams();
        },
        computed: {
            fileUploadData: function () {
                return {
                    creatorUid: localStorage.getItem('cp_uid'),
                    rootId: this.$route.params.rootId,
                    nodeId: this.currentNodeId
                }
            }
        }
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

    .doc-markdown-show-card,
    .doc-markdown-edit-card,
    .doc-richtext-edit-card,
    .doc-richtext-show-card,
    .attachments-show-card {
        margin-top: 10px;
        width: 100%;
        height: auto;
        max-width: 980px;
        padding-bottom: 15px;
    }

    .add-doc-card {
        margin-top: 10px;
        width: 100%;
        height: auto;
        max-width: 980px;
    }

    .editor-card-below {
        margin-top: 15px;
        width: 100%;
        min-height: 200px;
    }

    .hr-editor {
        margin-top: 15px;
        height: 1px;
        border: none;
        border-top: 1px dashed darkgray;
    }

    .input-md-title, .input-rt-title {
        background-color: #fff;
        background-image: none;
        border: none;
        box-sizing: border-box;
        color: #5a5e66;
        display: inline-block;
        font-size: 30px;
        height: 40px;
        line-height: 1;
        outline: 0;
        padding: 0 15px;
        width: 100%;
    }

    .title-show {
        background-color: #fff;
        background-image: none;
        box-sizing: border-box;
        color: #5a5e66;
        font-size: 30px;
        height: 40px;
        outline: 0;
        padding: 0 15px;
        width: 100%;
    }

</style>
