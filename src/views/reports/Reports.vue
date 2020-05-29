<!--  -->
<template>
  <div>
    <!-- 面包屑导航 -->
    <breadcrumb>
      <el-breadcrumb-item slot="center">数据统计</el-breadcrumb-item>
      <el-breadcrumb-item slot="right">数据报表</el-breadcrumb-item>
    </breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 2视图区 -->
      <div id="main" style="width: 800px;height:500px;"></div>
    </el-card>
  </div>
</template>

<script>
import breadcrumb from "../../components/breadcrumb"; //面包屑
import _ from 'lodash'
//1导入
import echarts from "echarts";
export default {
  components: {
    breadcrumb
  },
  data() {
    return {
      //需要合并的数据
      options: {
        title: {
          text: "用户来源"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3"
            }
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ]
      }
    };
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  async mounted() {
    //3 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("main"));

    const { data: res } = await this.$http.get("reports/type/1");
    if (res.meta.status !== 200) {
      return this.$message.error("获取折线图数据失败！");
    }

    //4 指定图表的配置项和数据

    //利用深拷贝合并数据
    // const result = _.merge(res.data,this.options)
    const result = Object.assign(this.options,res.data)

    // var option = {
    //   title: {
    //     text: "ECharts 入门示例"
    //   },
    //   tooltip: {},
    //   legend: {
    //     data: ["销量"]
    //   },
    //   xAxis: {
    //     data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
    //   },
    //   yAxis: {},
    //   series: [
    //     {
    //       name: "销量",
    //       type: "bar",
    //       data: [5, 20, 36, 10, 10, 20]
    //     }
    //   ]
    // };

    //5 使用刚指定的配置项和数据显示图表。
    myChart.setOption(result);
    window.onresize = myChart.resize;
  }
};
</script>
<style scoped>
/* @import url(); 引入css类 */
</style>