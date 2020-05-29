<!--  -->
<template>
  <div>
    <!-- 面包屑导航 -->
    <breadcrumb>
      <el-breadcrumb-item slot="center">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item slot="right">商品列表</el-breadcrumb-item>
    </breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索 添加  -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable @clear="getGoodsList" v-model="goodsInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 视图 -->
      <el-table :data="goodslist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格（元）" prop="goods_price" width="100px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="100px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="250px">
          <template scope="scope">
            {{scope.row.add_time | showDate}}
          </template>
        </el-table-column>
        <el-table-column label="操作" prop="username" width="200px">
          <template scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeGoodsById(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="goodsInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="goodsInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import breadcrumb from "../../components/breadcrumb"; //面包屑
import { formatDate } from "../../common/common"; //时间戳
export default {
  components: {
    breadcrumb
  },
  data() {
    return {
      goodsInfo: {
        query: "",
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 10
      },
      goodslist: [],
      total: 0
    };
  },
  methods: {
    getGoodsList() {
      this.$http.get("goods", { params: this.goodsInfo }).then(res => {
        if (res.data.meta.status !== 200) {
          return this.$message.error("获取商品列表失败！");
        }
        this.goodslist = res.data.data.goods;
        this.total = res.data.data.total;
      });
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.goodsInfo.pagesize = newSize
      this.getGoodsList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage)
      this.goodsInfo.pagenum = newPage
      this.getGoodsList()
    },
    // 根据Id删除对应的用户信息
    async removeGoodsById(id) {
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

      const { data: res } = await this.$http.delete('goods/' + id)

      if (res.meta.status !== 200) {
        return this.$message.error('删除商品失败！')
      }

      this.$message.success('删除商品成功！')
      this.getGoodsList()
    },
    goAddpage(){
      this.$router.push('/goods/add')
    }
  },
  filters: {
    showDate: function(value) {
      let date = new Date(value * 1000);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    }
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {
    this.getGoodsList();
  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {}
};
</script>
<style scoped>
/* @import url(); 引入css类 */
</style>