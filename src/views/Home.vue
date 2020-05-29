<template>
  <el-container class="home_comtainer">
    <!-- 头 -->
    <el-header>
      <div class>霍格沃茨商城</div>
      <el-button type="danger" @click="live">退出</el-button>
    </el-header>
    <el-container>
      <!-- 左侧 -->
      <el-aside :width="isfalg ? '64px' : '200px'">
        <div class="toggle-button" @click="toggle">|||</div>
        <el-menu :default-active="$route.path"  class="el-menu-vertical-demo" background-color="#333744" text-color="#fff" active-text-color="#0099cc" unique-opened :collapse="isfalg" :collapse-transition="false" router >
          <!-- 一级 -->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <template slot="title">
              <i :class="icons[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
 
            <el-menu-item :index="'/'+subitem.path" v-for="subitem in item.children" :key="subitem.id">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subitem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>

        </el-menu>
      </el-aside>
      <!-- 主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menulist:[],
      icons:{
        "125":'iconfont icon-user',
        "103":'iconfont icon-tijikongjian',
        "101":'iconfont icon-shangpin',
        "102":'iconfont icon-danju',
        "145":'iconfont icon-baobiao',
      },
      isfalg:false

    };
  },
  methods: {
    live() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // async getMuneList(){
    //   const{data:res} = await this.$http.get('menus')
    //   console.log(res);
    // }
    getMuneList(){
      this.$http.get('menus').then(res =>{
        // console.log(res);
        if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
        this.menulist = res.data.data
      })
    },
    //点击折叠
    toggle(){
      this.isfalg = !this.isfalg
    }

  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {
    this.getMuneList()
  },
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {}
};
</script>
<style lang="less" scoped>
/* @import url(); 引入css类 */
.home_comtainer {
  height: 100vh;
}
.el-header {
  background: #0099cc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 24px;
  font-weight: bold;
}
.el-aside {
  background: #333744;
  .el-menu{
    border: none;
  }
}
.el-main {
  background: rgb(240, 242, 245);
}
.iconfont{
  margin-right: 10px;
}
.toggle-button{
  background-color: #4A5064;
  color: #fff;
  font-size: 10px;
  line-height: 30px;
  text-align: center;
  letter-spacing: 2px;
  cursor: pointer;
}
</style>