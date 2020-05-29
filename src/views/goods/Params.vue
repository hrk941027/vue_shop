<!--  -->
<template>
  <div>
    <!-- 面包屑导航 -->
    <breadcrumb>
      <el-breadcrumb-item slot="center">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item slot="right">分类参数</el-breadcrumb-item>
    </breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning" :closable="false" show-icon></el-alert>
      <!-- 选择商品分类 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectedKeys"
            :options="goodsParamList"
            :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name',children:'children'}"
            @change="parentCateChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- tab分类 -->
      <el-tabs v-model="activeName" @tab-click="tabHandleClick">
        <!-- 添加动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            :disabled="isBtnDisable"
            size="mini"
            @click="addRightDialogVisible = true"
          >添加参数</el-button>
          <el-table :data="manyTableData" style="width: 100%">
            <!-- 展开 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i,scope.row)">{{item}}</el-tag>
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="nimi"
                  icon="el-icon-edit"
                  @click="editParams(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  size="nimi"
                  icon="el-icon-delete"
                  @click="remove(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            :disabled="isBtnDisable"
            size="mini"
            @click="addRightDialogVisible = true"
          >添加属性</el-button>
          <el-table :data="onlyTableData" style="width: 100%">
            <el-table-column type="expand">
              <template scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClose(i,scope.row)">{{item}}</el-tag>
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template scope="scope">
                <el-button
                  type="primary"
                  size="nimi"
                  icon="el-icon-edit"
                  @click="editParams(scope.row.attr_id)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  size="nimi"
                  icon="el-icon-delete"
                  @click="remove(scope.row.attr_id)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 新增参数对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addRightDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form :model="addFrom" :rules="addRules" ref="addFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editRightDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form :model="editFrom" :rules="editRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editFrom.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParamsInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import breadcrumb from "../../components/breadcrumb"; //导入导航
export default {
  components: {
    breadcrumb
  },
  data() {
    return {
      goodsParamList: [],
      //级联选择框双向绑定到的数据
      selectedKeys: [],
      //被激活的页签的名称
      activeName: "many",
      manyTableData: [],
      onlyTableData: [],
      addRightDialogVisible: false,
      //新增属性的表单数据对象
      addFrom: {
        attr_name: ""
      },
      addRules: {
        attr_name: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ]
      },
      editRightDialogVisible: false,
      editFrom: {
        attr_name: ""
      },
      editRules: {
        attr_name: [
          { required: true, message: "请输入角色名称", trigger: "blur" }
        ]
      },
      //
      // inputVisible : false,
      // //文本框输入内容默认为空
      // inputValue : ''
    };
  },
  methods: {
    //获取商品分类列表
    getgoodsParamList() {
      this.$http.get("categories").then(res => {
        if (res.data.meta.status !== 200) {
          return this.$message.error("获取商品分类失败");
        }
        this.goodsParamList = res.data.data;
        // console.log(this.goodsParamList);
      });
    },
    //级联选择器发生变化，触发这个函数
    parentCateChange() {
      // console.log(this.selectedKeys);
      this.getParamsData();
    },
    //获取商品参数列表
    getParamsData() {
      // console.log(this.selectedKeys);
      //如果selectedKeys中的length不等于3
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = [];
        this.manyTableData = [];
        this.onlyTableData = []
        return;
      }
      //否则证明是选中的三级分类
      // console.log(this.selectedKeys);
      //根据所选分类的id，和当前的面板，获取对应商品的参数
      this.$http
        .get(`categories/${this.cateId}/attributes`, {
          params: { sel: this.activeName }
        })
        .then(res => {
          // console.log(res);
          if (res.data.meta.status !== 200) {
            return this.$message.error("获取参数失败");
          }

          //给小标签循环将字符串转成数组
          res.data.data.forEach(item => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : [];
            //控制文本框的显示与隐藏
            item.inputVisible = false
            //文本框中输入的值
            item.inputValue = ''
          });
          console.log(res.data);

          //获取到数据之后，也要先判断一下是赋值给静态参数还是动态参数
          if (this.activeName === "many") {
            this.manyTableData = res.data.data;
          } else {
            this.onlyTableData = res.data.data;
          }
        });
    },
    //tab页点击事件
    tabHandleClick() {
      // console.log(this.activeName);
      this.getParamsData();
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields(); //重置对话框表格内容
    },
    //确定添加参数
    addParams() {
      this.$refs.addFormRef.validate(valid => {
        if (!valid) return;
        this.$http
          .post(`categories/${this.cateId}/attributes`, {
            attr_name: this.addFrom.attr_name,
            attr_sel: this.activeName
          })
          .then(res => {
            if (res.data.meta.status !== 201) {
              return this.$message.error("添加参数失败！");
            }
            this.$message.success("添加参数成功！");
            this.getParamsData();
            this.addRightDialogVisible = false;
          });
      });
    },
    //点击编辑，传递当前参数id，并且获取分类id，
    editParams(attr_id) {
      this.$http
        .get(`categories/${this.cateId}/attributes/${attr_id}`, {
          params: { attr_sel: this.activeName }
        })
        .then(res => {
          // console.log(res);
          if (res.data.meta.status !== 200) {
            return this.$message.error("查询参数信息失败！");
          }
          this.editFrom = res.data.data;
          // console.log(this.editFrom);
        });
      this.editRightDialogVisible = true;
    },
    editParamsInfo() {
      this.$refs.editFormRef.validate(valid => {
        if (!valid) return;
        this.$http
          .put(
            `categories/${this.cateId}/attributes/${this.editFrom.attr_id}`,
            { attr_name: this.editFrom.attr_name, attr_sel: this.activeName }
          )
          .then(res => {
            if (res.data.meta.status !== 200) {
              return this.$message.error("更新参数失败！");
            }
            this.$message.success("更新参数成功！");
            this.getParamsData();
            this.editRightDialogVisible = false;
          });
      });
    },
    editDialogClosed() {
      this.$refs.editFormRef.resetFields(); //重置对话框表格内容
    },
    // 根据Id删除对应的用户信息
    async remove(attr_id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        "此操作将永久删除该参数, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);

      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消了删除，则返回值为字符串 cancel
      // console.log(confirmResult)
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }

      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attr_id}`
      );

      if (res.meta.status !== 200) {
        return this.$message.error("删除参数失败！");
      }

      this.$message.success("删除参数成功！");
      this.getParamsData();
    },
    //失去焦点或回车都会触发该函数
    handleInputConfirm(row){
      // console.log(123);
      if(row.inputValue.trim().length === 0){
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      //如果没有return说明用户输入了内容，需要做后续处理（添加数据）
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      //并且需要发起请求修改数据库
      this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
        attr_name : row.attr_name,
        attr_sel : row.attr_sel,
        attr_vals: row.attr_vals.join(',')
      }).then(res =>{
        if (res.data.meta.status !== 200) {
              return this.$message.error("添加参数失败！");
            }
            this.$message.success("添加参数成功！");
      })
    },
    //显示tag输入框
    showInput(row){
      row.inputVisible = true
      //让文本框自动获取焦点
      this.$nextTick(_ => { //当页面上元素被重新渲染后，才会指定回调函数中的代码
          this.$refs.saveTagInput.$refs.input.focus();
        });
    },
    //删除tag对应参数
    handleClose(i,row){
      row.attr_vals.splice(i,1)
      this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{
        attr_name : row.attr_name,
        attr_sel : row.attr_sel,
        attr_vals: row.attr_vals.join(',')
      }).then(res =>{
        if (res.data.meta.status !== 200) {
              return this.$message.error("删除参数失败！");
            }
            this.$message.success("删除参数成功！");
      })
    }
  },
  computed: {
    //如果按钮需要被禁用则返回ture
    isBtnDisable() {
      // if(this.selectedKeys.length !== 3){
      //   return ture
      // }
      // return false
      return this.selectedKeys.length !== 3;
    },
    //当前选中的三级分类的id
    cateId() {
      if (this.selectedKeys.length == 3) {
        // return this.selectedKeys[2] || null
        return this.selectedKeys[2];
      }
      return null;
    },
    //动态计算标题文本
    titleText() {
      // if(this.activeName === 'many'){
      //   return '动态参数'
      // }
      // return '静态属性'
      return this.activeName === "many" ? "动态参数" : "静态属性";
    }
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {
    this.getgoodsParamList();
  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {}
};
</script>
<style scoped>
/* @import url(); 引入css类 */
.cat_opt {
  margin: 20px 0;
}
.el-tag {
  margin: 15px;
}
.input-new-tag{
  width: 150px;
}
</style>