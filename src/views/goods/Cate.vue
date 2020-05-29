<!--  -->
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加分类  -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addGoodsCate">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 展示  引用tree插件-->
      <tree-table
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
      >
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            style="color:lightgreen"
            v-if="scope.row.cat_deleted === false"
          ></i>
          <i class="el-icon-error" style="color:red" v-else></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="editRoles(scope.row.cat_id)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="remove(scope.row.cat_id)">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="showAddGoodsCate" width="50%" @close = "addCateClose">
      <el-form :model="addCateForm" ref="addCateFormRef" :rules="addCateFormRules" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- options用来指定数据 -->
          <!-- props用来指定配置对象 -->
          <el-cascader
            v-model="selectedKeys"
            :options="parentsList"
            :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name',children:'children',checkStrictly:true}"
            @change="parentCateChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showAddGoodsCate = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类对话框 -->
    <el-dialog title="编辑分类" :visible.sync="editRightDialogVisible" width="50%" >
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      cateList: [],
      //为table指定列的定义
      columns: [
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          //表示将当前的列定义成模板列
          type: "template",
          //表示当前这一列使用的模板名称
          template: "isok"
        },
        {
          label: "排序",
          //表示将当前的列定义成模板列
          type: "template",
          //表示当前这一列使用的模板名称
          template: "order"
        },
        {
          label: "操作",
          //表示将当前的列定义成模板列
          type: "template",
          //表示当前这一列使用的模板名称
          template: "opt"
        }
      ],
      showAddGoodsCate: false,
      //填写的分类表单
      addCateForm: {
        //填写的分类名称,id,分类等级
        cat_name: "",
        cat_pid: 0,
        cat_level: 0
      },
      //新增分类校验
      addCateFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      //父级分类数据
      parentsList: [],
      //选中的父级分类的ID数组
      selectedKeys:[],
      editRightDialogVisible : false,
      //编辑表单
      editForm:{},
      //验证编辑
      editFormRules :{
        cat_name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
      },
    };
  },
  methods: {
    getCateList() {
      this.$http.get("categories", { params: this.querInfo }).then(res => {
        // console.log(res);
        if (res.data.meta.status !== 200) {
          return this.$message.error("获取商品分类失败");
        }
        this.cateList = res.data.data.result;
        this.total = res.data.data.total;
        // this.$message.success('获取商品分类成功');
        // console.log(this.cateList);
      });
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.querInfo.pagesize = newSize;
      this.getCateList();
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      // console.log(newPage)
      this.querInfo.pagenum = newPage;
      this.getCateList();
    },
    //添加分类
    addGoodsCate() {
      //先获取父级分类列表
      this.getParentCateList();
      //再弹出对话框
      this.showAddGoodsCate = true;
      // this.$http.post
    },
    //获取父级分类列表
    getParentCateList() {
      this.$http.get("categories", { params: { type: 2 } }).then(res => {
        // console.log(res.data);
        if (res.data.meta.status !== 200) {
          return this.$message.error("获取父级分类数据失败");
        }
        this.parentsList = res.data.data;
        
      });
    },
    //父级分类选择项发生改变触发这个函数
    parentCateChange(){
      console.log(this.selectedKeys);
      //如果selectedKeys中的length大于0，证明选中的父级分类
      //反之就说明没有选中任何分类，那么就是一级分类，cat_pid和分类等级都是0
      if(this.selectedKeys.length > 0){
        //父级分类的id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        //当前分类等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      } else {
        //父级分类的id
        this.addCateForm.cat_pid = 0
        //当前分类等级赋值
        this.addCateForm.cat_level = 0
      }
       
    },
    //确定添加
    addCate(){
      console.log(this.addCateForm);
      this.$refs.addCateFormRef.validate(valid =>{
        if(!valid) return
        this.$http.post('categories',this.addCateForm).then(res =>{
          if (res.data.meta.status !== 201) {
            return this.$message.error('添加商品分类失败！')
          }
          this.$message.success('添加商品分类成功！')
          this.getCateList()
          this.showAddGoodsCate =false
        })
      })
      
    },
    //关闭添加分类对话框并清空数据
    addCateClose(){
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    //打开编辑分类对话框根据id获取信息
    editRoles(id){
      this.$http.get('categories/' + id).then(res =>{
        // console.log(res);
        if (res.data.meta.status !== 200) {
          return this.$message.error('查询用户信息失败！')
        }
        this.editForm = res.data.data
        console.log(this.editForm);
      })
      this.editRightDialogVisible = true
    },
    //编辑分类信息
    editRoleInfo(){
      this.$refs.editFormRef.validate(valid =>{
        if (!valid) return
        this.$http.put(
          'categories/' + this.editForm.cat_id,
          {
            cat_name: this.editForm.cat_name,
          }
        ).then(res =>{
          if (res.data.meta.status !== 200) {
            return this.$message.error('更新分类信息失败！')
          }
          this.$message.success('更新分类信息成功！')
          this.getCateList()
          this.editRightDialogVisible = false
        })
      })
    },
    // 根据Id删除对应的分类信息
    async remove(id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该分类, 是否继续?',
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

      const { data: res } = await this.$http.delete('categories/' + id)

      if (res.meta.status !== 200) {
        return this.$message.error('删除分类失败！')
      }

      this.$message.success('删除分类成功！')
      this.getCateList()
    },
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {
    this.getCateList();
  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {}
};
</script>
<style scoped>
/* @import url(); 引入css类 */
.zk-table {
  margin: 20px 0;
}
.el-cascader{
  width: 100%;
}
</style>