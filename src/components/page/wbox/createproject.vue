<template>
  <div class="table">
  <div v-show='wboxInfoFormVisible'>
  <div class="crumbs">
      <el-breadcrumb separator="/">
          <el-breadcrumb-item><i class="el-icon-share"></i>项目管理</el-breadcrumb-item>
          <el-breadcrumb-item>创建项目</el-breadcrumb-item>
      </el-breadcrumb>
  </div>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
    <el-form-item label="项目名称" prop="name">
      <el-input v-model="ruleForm.name"></el-input>
    </el-form-item>
    <el-form-item label="英文名称" prop="ename">
      <el-input v-model="ruleForm.ename"></el-input>
    </el-form-item>
    <el-form-item label="项目路径" prop="path">
      <el-input v-model="ruleForm.path"></el-input>
    </el-form-item>
    <el-form-item label="">
    <div class="plugins-tips">
        路径规则示例：https://www.baidu.com
    </div>
    </el-form-item>
    <el-form-item label="权限设置" prop="delivery">
      <el-switch v-model="ruleForm.delivery"></el-switch>
    </el-form-item>
    <el-form-item label="项目简介" prop="desc">
      <el-input type="textarea" v-model="ruleForm.desc"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="toSetUser('ruleForm')">立即创建</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</div>
 <div>
    <el-dialog :show-close=false :close-on-click-modal=false  title="设置参与人员" :visible.sync="setJionPepopleFormVisible">
        <el-form :model="createGroupForm" :rules="rules" ref="createGroupForm"
                 label-width="100px" class="demo-ruleForm">
          <el-row :gutter="20">
             <el-col :span="12"><div class="grid-content bg-purple">
               <p class="icon-s"><span><i class="el-icon-search"></i>选择：</span></p>
              <el-input
                placeholder="输入关键字进行过滤"
                v-model="filterText">
              </el-input>
              <el-tree class="filter-tree"
                :data="data2"
                show-checkbox
                accordion
                node-key="id"
                :expand-on-click-node="true"
                :props="defaultProps"
                @check-change="getChange"
                :filter-node-method="filterNode"
                :render-content="renderContent"
                ref="tree2">
              </el-tree>
             </div></el-col>
             <el-col :span="12"><div class="grid-content bg-purple">
               <p class="icon-s"><span><i class="el-icon-menu"></i>已选：</span></p>
               <div class="selected">
                 <div style="height:200px;">
                 <el-tag size="small"
                    v-for="tag in tags"
                    :key="tag.id"
                    closable
                    @close="handleClose(tag.id)"
                    disable-transitions
                    :type="tag.type">
                    {{tag.label}}
                  </el-tag></div>
                  <div style="border-top:1px solid #d8dce5;height:100px;">
                     <p class="icon-s"><span><i class="el-icon-setting"></i>管理员：</span></p>
                  <el-tag size="small"
                     v-for="admin in admintags"
                     :key="admin.id"
                     closable
                     @close="handleCloseAdmin(admin.id)"
                     disable-transitions
                     :type="admin.type">
                     {{admin.label}}
                   </el-tag>
                 </div>
               </div>
             </div></el-col>
            </el-col>
           </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm('createGroupForm')">确 定</el-button>
            <el-button type="primary" @click="notSetUser('createGroupForm')">暂不设置</el-button>
            <el-button @click="changeVisible()">取 消</el-button>
        </div>
    </el-dialog>
</div>
</div>
</template>
  <script>
  import WboxApiUtils from '../../../utils/WboxApiUtils';
    export default {
      data() {
        return {
          testHtml:"<span>这是个测试<span>",
          filterText: '',
          admintags:[],
          tags: [],
       data2: [],
       defaultProps: {
         children: 'children',
         label: 'label',
         item_type:'item_type',
         is_admin:'is_admin',
         id:'id'
       },
          wboxInfoFormVisible:true,
          setJionPepopleFormVisible:false,
          select_cate:'我的群组',
          ruleForm: {
            name: '',
            ename:'',
            path:'',
            delivery: false,
            desc: ''
          },
          createGroupForm:{
            projectInfos:''
          },
          rules: {
            name: [
              { required: true, message: '请输入项目名称', trigger: 'blur' },
              { min: 2, max: 128, message: '长度在 2 到 128 个字符', trigger: 'blur' }
            ],
            ename: [
              { required: true, message: '请输入项目英文名称', trigger: 'blur' },
              { min: 2, max: 128, message: '长度在 2 到 128 个字符', trigger: 'blur' }
            ],
            path: [
              { required: true, message: '请输按照路径示例格式填写项目路径', trigger: 'blur' },
              { min: 2, max: 300, message: '长度在 2 到 300 个字符', trigger: 'blur' }
            ],
            desc: [
              { required: false, message: '请填写项目简介', trigger: 'blur' }
            ]
          }
        };
      },
      methods: {
         submitForm(formName) {
            const self = this;
            let userIds = '';
            let adminuids = '';
            if(self.tags.length >0 || self.admintags.length > 0){//如果已经选择用户信息
              for (var i = 0; i < self.tags.length; i++) {
                if(i == self.tags.length-1){
                  userIds = userIds+self.tags[i].id;
                }else {
                  userIds = userIds+self.tags[i].id+',';
                }
              }
              for (var i = 0; i < self.admintags.length; i++) {
                if(i == self.admintags.length-1){
                  adminuids = adminuids+self.admintags[i].id;
                }else {
                  adminuids = adminuids+self.admintags[i].id+',';
                }
              }

              let params = self.toCleanParams();
              params.uids = userIds;
              params.adminuids = adminuids;
              self.toCreateProject(params);
            }else {
              self.$message.error('请选择参与人员')
            }

          },
         resetForm(formName) {
            this.$refs[formName].resetFields();
          },
         notSetUser(formName){
            let params = this.toCleanParams();
            this.toCreateProject(params);
          },
         toCleanParams(){
            const self = this;
            let status = 0;
            let username = localStorage.getItem('cp_username');
            if(self.ruleForm.delivery){
              let status = 1;
            }
            let projectinfo = {
              name : self.ruleForm.name,
              ename : self.ruleForm.ename,
              username : username,
              status : status,
              desc : self.ruleForm.desc,
              path : self.ruleForm.path,
              uids :'',
              adminuids :'',
            };
            return projectinfo;
          },
          //创建新的项目
         toCreateProject(params){
            const self = this;
            WboxApiUtils.createProject(params).then(function(data) {
              if(data.code == 100){
                 self.$message.success('项目创建成功');
                 //跳转到我的项目列表
                 self.$router.push('/wbox/myprojects');
              }else{
                console.log(data.message);
                self.$message.error(data.message);
              }
            });
          },
         changeVisible(){
            if(this.wboxInfoFormVisible){
                this.wboxInfoFormVisible = false;
                this.setJionPepopleFormVisible = true;
            }else{
                this.setJionPepopleFormVisible = false;
                this.wboxInfoFormVisible = true;
            }
          },
         getChange(data,ischecked){
            if(data.item_type == 'user'  && ischecked){
               if(data.is_admin){
                    this.addAdminUsers(data);
               }else{
                   this.addCheckUser(data);
               }
            }else if (data.item_type =='user' && !ischecked) {
               if(data.is_admin){
                 this.handleCloseAdmin(data.id);
               }else{
                this.deletedCheckUser(data);
              }
            }else if(data.item_type == 'group' && ischecked){
              let children = data.children;
              for (var i = 0; i < children.length; i++) {
                  if(children[i].is_admin){
                    continue;
                  }else{
                    this.addCheckUser(children[i]);
                  }
              }
            }
          },
         addCheckUser(data){
             let checked  = this.tags;
               if(checked.length == 0){
                  this.addETags(data);
               }else {
                 let isChecked = false;
                 for (var i = 0; i < checked.length; i++) {
                   if(data.id === checked[i].id){
                     isChecked = true;
                   }
                 }
                 if(!isChecked){
                   this.addETags(data);
                 }
               }
          },
         deletedCheckUser(data){
            let checked = this.tags;
            let newChecked = [];
            for (var i = 0; i < checked.length; i++) {
              if(data.id == checked[i].id){
                continue;
              }else{
                newChecked.push(checked[i]);
              }
            }
            this.tags = newChecked;
          },
         addETags(data){
            let newtags = this.tags;
            let tag =[];
            tag.label = data.label;
            tag.id = data.id;
            tag.is_admin = data.is_admin;
            let color = this.getColor();
            tag.type = ''+color;
            newtags.push(tag);
            this.tags = newtags;
          },
         handleClose(id){
             let index = id+'';
             let checked = this.tags;
             let newChecked = [];
             for (var i = 0; i < checked.length; i++) {
               if(id == checked[i].id){
                 continue;
               }else{
                 newChecked.push(checked[i]);
               }
             }
             this.tags = newChecked;
             this.$refs.tree2.setChecked(index,false,false);

           },
         handleCloseAdmin(id){
            const self = this;
            const admins = self.admintags;
            const newtags = [];
            for (var i = 0; i < self.data2.length; i++) {
              if(self.data2[i].children.length > 0){
                for (var j = 0; j < self.data2[i].children.length; j++) {
                  if(self.data2[i].children[j].id == id){
                     self.data2[i].children[j].is_admin = false;
                  }
                }
              }
            }
            for (var i = 0; i < admins.length; i++) {
              if(admins[i].id == id){
                continue;
              }else{
                newtags.push(admins[i]);
              }
            }
            self.admintags = newtags;
            this.$refs.tree2.setChecked(id,false,false);
          },
         getColor(){
            let color = ['warning','success','info','danger'];
            let i =parseInt(4*Math.random());
            return color[i];
          },
          //获取我的群组信息
         getMyGroup(){
            let self = this;
            let params = {
                  username: localStorage.getItem('cp_username')
                };
                WboxApiUtils.getMyGroups(params).then(function (data) {
                    if (data.code === 100) {
                      self.data2 = data.data;
                    } else {
                        //失败提示
                        console.log(data.message);
                        self.$message.error(data.message);
                    }
                });
          },
         toSetUser(formName){
            let self = this;
            self.$refs[formName].validate((valid) => {
              if (valid) {
                self.changeVisible();
                self.getMyGroup();
                self.admintags = [];
              } else {
                self.$message.error('请检验所填参数');
                console.log('error submit!!');
                return false;
              }
            });
          },
         filterNode(value, data) {
             if (!value) return true;
             return data.label.indexOf(value) !== -1;
           },
         setAdmin(node,data) {
            const self = this;
            data.is_admin = true;
             if(node.checked){
               self.deletedCheckUser(data);
               self.addAdminUsers(data);
             }else{
               let id = data.id+'';
               this.$refs.tree2.setChecked(id,true,false);//添加
             }
          },
         getAdminTags(data){
           let tag =[];
           tag.label = data.label;
           tag.id = data.id;
           tag.is_admin = data.is_admin;
           let color = this.getColor();
           tag.type = ''+color;
           return tag;
         },
         addAdminUsers(node){
           const self = this;
           const admins = self.admintags;
           if(admins.length == 0){
             let tag = self.getAdminTags(node);
             self.admintags.push(tag);
           }else{
             let flag = true;
             for (var i = 0; i < admins.length; i++) {
               if(admins[i].id == node.id){
                 flag = false;
               }
             }
             if(flag){
               let tag = self.getAdminTags(node);
               self.admintags.push(tag);
             }
           }
         },
         remove(node, data) {
          const index = children.findIndex(d => d.id === data.id);
          children.splice(index, 1);
          },
         renderContent(h, { node, data, store }) {
            if(node.isLeaf && node.data.item_type == 'user'){
              return (
                <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
                  <span>
                    <span>{node.label}</span>
                  </span>
                  <span>
                      <el-button  style="font-size: 12px;" type="text" on-click={ () => this.setAdmin(node,data) }>设为管理员</el-button>
                  </span>
                </span>);
            }else{
              return (
                <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
                  <span>
                    <span>{node.label}</span>
                  </span>
                </span>);
            }
           }
        },
         watch: {
         filterText(val) {
           this.$refs.tree2.filter(val);
         }
       }
      }
  </script>

  <style scoped="true">
    .table {
      width: 70%;
    }
    .selected{
      height:300px;
      margin-top:8px;
      border-color: #b4bccc;
      border: 1px solid #d8dce5;
      border-radius: 4px;
      box-sizing: border-box;
    }
    .plugins-tips {
        padding: 1px 12px;
        margin-bottom: -2px;
    }
 .text {
      font-size: 14px;
    }
 .icon-s{
   color: #878d99;
   margin-bottom: 8px;
   font-size: 14px;
 }
 .item {
   margin-bottom: 18px;
 }
 .clearfix:after {
   display: table;
   content: "";
 }
 .clearfix:after {
   clear: both
 }
 .user-list{
    padding: 18px 20px;
    border-bottom: 1px solid #e6ebf5;
    box-sizing: border-box;
 }
 .box-card {
   width: 100%;
 }
 .box-card-s {
   width: 100%;
   height: 150px;
   margin-bottom: 15px;
 }
 .setjion {
   margin-top:20px;
 }
 .el-row {
   margin-bottom: 20px;
   &:last-child {
     margin-bottom: 0;
   }
 }
 .el-col {
   border-radius: 4px;
 }
 .bg-purple-dark {
   background: #99a9bf;
 }
 .bg-purple-light {
   background: #e5e9f2;
 }
 .grid-content {
   border-radius: 4px;
   min-height: 36px;
 }
 .row-bg {
   padding: 10px 0;
   background-color: #f9fafc;
 }
 .el-tag{
   margin-top: 12px;
 }
 .el-tag--small{
   margin-left: 20px;
   margin-right: 2px;
 }
  </style>
