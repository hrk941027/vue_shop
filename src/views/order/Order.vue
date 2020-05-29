<!--  -->
<template>
  <div>
    <!-- 面包屑导航 -->
    <breadcrumb>
      <el-breadcrumb-item slot="center">订单管理</el-breadcrumb-item>
      <el-breadcrumb-item slot="right">订单列表</el-breadcrumb-item>
    </breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 搜索  -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable @clear="getorderList" v-model="orderInfo.query">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 视图 -->
      <el-table :data="orderlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send">
          <template slot-scope="scope">
            <template>{{scope.row.is_send}}</template>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">{{scope.row.create_time | showDate}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showBox"></el-button>
            <el-button size="mini" type="success" icon="el-icon-location" @click="showProgressBox"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="orderInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="orderInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 选择地址对话框 -->
    <el-dialog title="请选择地址：" :visible.sync="dressdialogVisible" width="50%" @close="closedbox">
      <el-form
        :model="dressruleForm"
        :rules="dressrules"
        ref="adressruleFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="dressruleForm.address1"
            :options="citydata"
            :props="{ expandTrigger: 'hover' }"
            @change="handleChange"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="dressruleForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dressdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dressdialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 物流进度对话框 -->
    <el-dialog title="物流进度查询" :visible.sync="wuliudialogVisible" width="50%">
      <el-timeline >
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>


<script>
import breadcrumb from "../../components/breadcrumb"; //面包屑
import { formatDate } from "../../common/common"; //时间戳
import citydata from "./citydata"; //城市
export default {
  components: {
    breadcrumb
  },
  data() {
    return {
      orderInfo: {
        query: "",
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 10
      },
      orderlist: [],
      total: 0,
      dressdialogVisible: false,
      wuliudialogVisible: false,
      dressruleForm: {
        address1: [],
        address: ""
      },
      dressrules: {
        address1: [
          { required: true, message: "请选择正确地址", trigger: "blur" }
        ],
        address2: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ]
      },
      citydata,
      progressInfo: []
    };
  },
  methods: {
    getorderList() {
      this.$http.get("orders", { params: this.orderInfo }).then(res => {
        if (res.data.meta.status !== 200) {
          return this.$message.error("获取订单列表失败！");
        }
        this.orderlist = res.data.data.goods;
        this.total = res.data.data.total;
      });
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.orderInfo.pagesize = newSize;
      this.getorderList();
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage);
      this.orderInfo.pagenum = newPage;
      this.getorderList();
    },
    showBox() {
      this.dressdialogVisible = true;
    },
    closedbox() {
      this.$refs.adressruleFormRef.resetFields();
    },
    showProgressBox() {
      this.$http.get("/kuaidi/1106975712662").then(res => {
        if (res.data.meta.status !== 200) {
          return this.$message.error("获查询物流信息失败！");
        }
        this.progressInfo = res.data.data;
        console.log(this.progressInfo);
      });
      this.wuliudialogVisible = true;
    },
    handleChange() {
      console.log(this.dressruleForm.address1);
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
    this.getorderList();
  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {}
};
</script>
<style scoped>
/* @import url(); 引入css类 */
.el-cascader {
  width: 100%;
}
</style>