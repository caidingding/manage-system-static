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
      <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</div>
 <div>
    <el-dialog title="设置参与人员" :visible.sync="setJionPepopleFormVisible">
        <el-form :model="createGroupForm" :rules="createGroupFormRules" ref="createGroupForm"
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
                :expand-on-click-node="true"
                :props="defaultProps"
                :render-content="renderContent"
                :filter-node-method="filterNode"
                @check-change='getChange'
                ref="tree2">
              </el-tree>
             </div></el-col>
             <el-col :span="12"><div class="grid-content bg-purple">
               <p class="icon-s"><span><i class="el-icon-menu"></i>已选：</span></p>
               <div class="selected">
               </div>
             </div></el-col>
            </el-col>
           </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm('createGroupForm')">确 定</el-button>
            <el-button @click="resetForm('createGroupForm')">取 消</el-button>
            <el-button ref="checked_node_click" @click="getCheckedNodes()">通过 node 获取</el-button>
        </div>
    </el-dialog>
</div>

</div>
</template>
  <script>
    export default {
      data() {
        return {
          selected_user:[],
          checked_user:[],
          filterText: '',
       data2: [{
         id: 1,
         label: '一级 1',
         type:2,
         children: [{
           id: 4,
           type:2,
           label: '二级 1-1',
           children: [{
             id: 9,
              type:2,
             label: '三级 1-1-1'
           }, {
             id: 10,
              type:2,
             label: '三级 1-1-2'
           }]
         }]
       }, {
         id: 2,
          type:1,
         label: '一级 2',
         children: [{
           id: 5,
            type:2,
           label: '二级 2-1'
         }, {
           id: 6,
           type:2,
           label: '二级 2-2'
         }]
       }, {
         id: 3,
         type:1,
         label: '一级 3',
         children: [{
           id: 7,
           type:2,
           label: '二级 3-1'
         }, {
           id: 8,
           type:2,
           label: '二级 3-2'
         }]
       }],
       defaultProps: {
         children: 'children',
         label: 'label',
         type:'type'
       },

          wboxInfoFormVisible:false,
          setJionPepopleFormVisible:true,
          select_cate:'我的群组',
          ruleForm: {
            name: '',
            ename:'',
            path:'',
            delivery: false,
            desc: ''
          },
          createGroupForm:{

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
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.changeVisible();
            } else {
              console.log('error submit!!');
              return false;
            }
          });
        },
        resetForm(formName) {
          this.$refs[formName].resetFields();
        },
        changeVisible(){
          if(this.wboxInfoFormVisible){
              this.wboxInfoFormVisible = false;
          }else{
              this.wboxInfoFormVisible = true;
          }
          if(this.setJionPepopleFormVisible){
            this.setJionPepopleFormVisible = false;
          }else{
            this.setJionPepopleFormVisible = true;
          }
        },
        getChange(data){
          this.getCheckedNode();
          alert(this.checked_user.length)

          //alert(checked.length);
          // for (let i = 0; i < selected.length; i++) {
          //   let node = selected[i];
          //   if (node.type === 2) {
          //     this.selected_user.push(selected[i]);
          //   }
          // }
          // console.log(this.selected_user);

        },
        getCheckedNodes() {
          this.checked_user = this.$refs.tree2.getCheckedNodes(false);
          alert(this.checked_user.length)
            //return this.$refs.tree2.getCheckedNodes();
          },
        //获取我的群组信息
        getMyGroup(){

        },
        filterNode(value, data) {
           if (!value) return true;
           return data.label.indexOf(value) !== -1;
         },
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
 .clearfix:before,
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
 .bg-purple {

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
  </style>
