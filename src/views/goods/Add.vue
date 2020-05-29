<!--  -->
<template>
  <div>
    <!-- 面包屑导航 -->
    <breadcrumb>
      <el-breadcrumb-item slot="center">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item slot="right">添加商品</el-breadcrumb-item>
    </breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!-- 步骤条 -->
      <el-steps :active="activeIndex * 1" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- tab  -->
      <el-form
        :model="addForm"
        :rules="addFormrules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          :tab-position="'left'"
          :before-leave="beforetableave"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price" type="number">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight" type="number">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number" type="number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name',children:'children' }"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 表单渲染的item 动态参数面板-->
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <!-- 参数的复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border :label="cb" v-for="(cb,i) in item.attr_vals" :key="i"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action 图片上传的地址 -->
            <el-upload
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handlesuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce">

            </quill-editor>
            <el-button type="primary" class="btnadd" @click="addgoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%" >
      <img :src="previewPath" alt="" class="previewimg">
    </el-dialog>
  </div>
</template>

<script>
import breadcrumb from "../../components/breadcrumb"; //面包屑

import _ from 'lodash'

export default {
  components: {
    breadcrumb
  },
  data() {
    return {
      activeIndex: "0",
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        //图片数组
        pics: [],
        //详情
        goods_introduce : '',
        attrs:[]
      },
      addFormrules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ],
        goods_cat: [
          { required: true, message: "请输入商品分类", trigger: "blur" }
        ]
      },
      //分类数据
      cateList: [],
      //动态参数列表
      manyTableData: [],
      onlyTableData: [],
      //上传图片的url地址
      uploadUrl: "http://timemeetyou.com:8889/api/private/v1/upload",
      //图片上传请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem("token")
      },
      previewPath: "",
      previewVisible : false
    };
  },
  methods: {
    getCateList() {
      this.$http.get("categories").then(res => {
        // console.log(res);
        if (res.data.meta.status !== 200) {
          return this.$message.error("获取商品分类失败");
        }
        this.cateList = res.data.data;
        // console.log(this.cateList);
      });
    },
    //级联选择器选中项发生变化会触发此函数
    handleChange() {
      // console.log(this.addForm.goods_cat);
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
        return;
      }
    },
    //阻止标签页切换，除非选择分类
    beforetableave(activeName, oldActiveName) {
      // console.log('即将离开的标签页是'+ oldActiveName);
      // console.log('即将进入的标签页是'+ activeName);
      // return false
      if (oldActiveName === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请先选择分类");
        return false;
      }
    },
    tabClick() {
      // console.log(this.activeIndex);
      if (this.activeIndex === "1") {
        this.$http
          .get(`categories/${this.cateId}/attributes`, {
            params: { sel: "many" }
          })
          .then(res => {
            if (res.data.meta.status !== 200) {
              return this.$message.error("获取动态参数失败！");
            }
            res.data.data.forEach(item => {
              item.attr_vals =
                item.attr_vals.length === 0 ? [] : item.attr_vals.split(",");
            });
            this.manyTableData = res.data.data;
            // console.log(res);
          });
      } else if (this.activeIndex === "2") {
        this.$http
          .get(`categories/${this.cateId}/attributes`, {
            params: { sel: "only" }
          })
          .then(res => {
            if (res.data.meta.status !== 200) {
              return this.$message.error("获取静态属性失败！");
            }
            // res.data.data.forEach(item => {
            //   item.attr_vals =
            //     item.attr_vals.length === 0 ? [] : item.attr_vals.split(",");
            // });
            this.onlyTableData = res.data.data;
            console.log(res);
          });
      }
    },
    //上传图片预览
    handlePreview(file) {
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    //移除图片
    handleRemove(file) {
      // console.log(file);
      //1.获取要删除图片的临时路径
      const filePath = file.response.data.tem_path;
      //2.从pics数组中找到这个图片的对应索引值
      const i = this.addForm.pics.findIndex(x => x.pic === filePath);
      //3.调用数组中的splice方法，把图片信息从pics数组中移除
      this.addForm.pics.splice(i, 1);
      console.log(this.addForm);
    },
    //监听图片上传成功的事件
    handlesuccess(response) {
      // console.log(response);
      //1.根据接口先拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path };
      //2.将图片信息对象，push到pics数组中
      this.addForm.pics.push(picInfo);
      // console.log(this.addForm);
    },
    //添加商品
    addgoods(){
      this.$refs.addFormRef.validate(valid =>{
        if(!valid) {
          return this.$message.error('请填写必要的表单项！')
        } 
        // JSON.parse(JSON.stringify())
        // const form = _.cloneDeep(this.addForm)
        // form.goods_cat = form.goods_cat.join(',')
        this.addForm.goods_cat = this.addForm.goods_cat.join(',')
        //动态参数
        this.manyTableData.forEach(item =>{
          const newInfo ={attr_id:item.attr_id,attr_value:item.attr_vals.join(',')}
          this.addForm.attrs.push(newInfo)
        })
        //静态属性
        this.onlyTableData.forEach(item =>{
          const newInfo ={attr_id:item.attr_id,attr_value:item.attr_vals}
          this.addForm.attrs.push(newInfo)
        })
        // form.attrs = this.addForm.attrs
        console.log(this.addForm);
        //发起请求
        //商品名称必须是唯一的
        this.$http.post(`goods`,this.addForm).then(res =>{
          console.log(res);
          
          if(res.data.meta.status !== 201){
            return this.$message.error('添加商品失败！')
          }
          this.$message.success('添加商品成功！')
          this.$router.push('/goods')
        })
        
      })
    }
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length == 3) {
        // return this.selectedKeys[2] || null
        return this.addForm.goods_cat[2];
      }
      return null;
    }
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
.el-checkbox {
  margin: 0 5px 0 0 !important;
}
.previewimg{
  width: 100%;
}
.btnadd{
  margin: 15px 0 0 0;
}
</style>