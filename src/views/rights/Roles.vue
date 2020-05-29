<!-- 角色列表 -->
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色 -->
      <el-row :gutter="20">
        <el-col>
          <el-button type="primary" @click="addRightDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 展示列表 -->
      <el-table :data="rolelist" border stripe>
        <!-- 展开 -->
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              :class="['bdbotton', i1 ===0 ? 'bdtop' : '','center']"
              v-for="(item1,i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级三级 -->
              <el-col :span="19">
                <!-- 嵌套循环二级 -->
                <el-row
                  :class="[i2 ===0 ? '' : 'bdtop','center']"
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3,i3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>
            {{scope.row}}
            </pre>-->
          </template>
        </el-table-column>
        <!-- ----- -->
        <el-table-column abel="#" type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" prop="level">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editRoles(scope.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="remove(scope.row.id)">删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addRightDialogVisible" width="50%" @close="addDialogClosed">
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRightDialogVisible = false">取 消</el-button>
        <el-button type="primary"  @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色对话框 -->
    <el-dialog title="编辑角色信息" :visible.sync="editRightDialogVisible" width="50%" >
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="showSetRightDialogVisible" width="50%" @close="setRightclose">
      <el-tree :data="rightsList" :props="treetProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showSetRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolelist: [],
      //控制分配权限对话框的显示与隐藏
      showSetRightDialogVisible:false,
      rightsList:[],
      //树形控件绑定对象
      treetProps:{
        label : 'authName',
        children : 'children'
      },
      //树形控件中默认选中的id值
      defKeys:[],
      //打开分配权限时，获取的当前的id
      roleId :'',
      addRightDialogVisible: false,
      //新增表单
      addForm : {
        roleName : '',
        roleDesc : ''
      },
      //新增表单用户规则
      addFormRules :{
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        roleDesc: [{ required: true, message: '请输入角色描述', trigger: 'blur' }],
      },
      editFormRules :{
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        roleDesc: [{ required: true, message: '请输入角色描述', trigger: 'blur' }],
      },
      //修改的表单对象
      editForm:{},
      editRightDialogVisible : false
    };
  },
  methods: {
    //获取角色列表
    getRoles() {
      this.$http.get("roles").then(res => {
        if (res.data.meta.status !== 200) {
          return this.$message.error("获取角色列表失败！");
        }
        this.rolelist = res.data.data;
        // console.log(this.rolelist);
      });
    },
    //添加角色
    addUser(){
      this.$refs.addFormRef.validate(valid =>{
        if (!valid) return
        this.$http.post('roles',this.addForm).then(res =>{
          if (res.data.meta.status !== 201) {
            return this.$message.error('添加角色失败！')
          }
          this.$message.success('添加角色成功！')
          this.getRoles()
          this.addRightDialogVisible = false
        })
      })
    },
    // 监听添加角色对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields() //重置对话框表格内容
    },
    //打开编辑角色对话框根据id获取信息
    editRoles(id){
      this.$http.get('roles/' + id).then(res =>{
        console.log(res);
        if (res.data.meta.status !== 200) {
          return this.$message.error('查询用户信息失败！')
        }
        this.editForm = res.data.data
        // console.log(this.editForm);
      })
      this.editRightDialogVisible = true
    },
    //编辑角色信息
    editRoleInfo(){
      this.$refs.editFormRef.validate(valid =>{
        if (!valid) return
        this.$http.put(
          'roles/' + this.editForm.roleId,
          {
            roleName: this.editForm.roleName,
            roleDesc: this.editForm.roleDesc
          }
        ).then(res =>{
          if (res.data.meta.status !== 200) {
            return this.$message.error('更新角色失败！')
          }
          this.$message.success('更新角色成功！')
          this.getRoles()
          this.editRightDialogVisible = false
        })
      })
    },
    // 根据Id删除对应的用户信息
    async remove(id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消了删除，则返回值为字符串 cancel
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }

      const { data: res } = await this.$http.delete('roles/' + id)

      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败！')
      }

      this.$message.success('删除用户成功！')
      this.getRoles()
    },
    //根据id删除权限
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("取消删除！");
      }
      // console.log('确认了删除');
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除权限失败");
      }
      this.$message.success("删除权限成功");
      // this.getRoles() 不建议调用方法不然会重新渲染整个表格，直接为角色信息赋值
      role.children = res.data;
    },
    //展示分配权限对话框
    showSetRightDialog(role) {
      this.roleId = role.id
      this.$http.get('rights/tree').then(res =>{
        // console.log(res);
        if (res.data.meta.status !== 200) {
          return this.$message.error("获取数据权限失败");
        }
        this.rightsList = res.data.data
        // console.log(this.rightsList);
      })
      //递归获取三级权限的id
      // this.defKeys=[]
      this.getleafKeys(role,this.defKeys)
      this.showSetRightDialogVisible = true
    },
    //通过递归，获取三级权限下的id并保存到数结构中的数组中
    getleafKeys(node,arr){
      //如果当前node中不包含children属性，则是三级节点
      if(!node.children){
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getleafKeys(item,arr)
      });
    },
    //关闭分配权限后清空数组中获取的id
    setRightclose(){
      this.defKeys=[]
    },
    //点击为角色分配权限
    //分配权限思路：首先打开分配权限时就获取当前角色的id并且存储起来，然后点击确定的时候，获取半选和全选状态的id值合并成一个完整的数组，做一个字符串的拼接
    //然后发送post请求修改状态，根据返回值判断失败和成功
    //最后刷新权限列表内容，关闭分配角色弹出框

    allotRights(){
      const keys = [   //将两个element-ui里树状图里自带的方法，拼接成新的数组获取半选，全选的id
        ...this.$refs.treeRef.getCheckedKeys(), 
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // console.log(keys);
      const idStr = keys.join(',')
      this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr}).then(res =>{
        if (res.data.meta.status !== 200) {
          return this.$message.error("分配权限失败");
        }
        this.$message.success("分配权限成功");
        this.getRoles()
        this.showSetRightDialogVisible = false
      })

    }
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {
    this.getRoles();
  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {}
};
</script>
<style scoped>
/* @import url(); 引入css类 */
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbotton {
  border-bottom: 1px solid #eee;
}
.center {
  display: flex;
  align-items: center;
}
</style>