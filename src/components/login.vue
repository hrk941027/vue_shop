<!--  -->
<template>
  <div class="login_container">
    <div class="login_box">
      <div class="title">
        <h3>霍格沃茨后台管理系统</h3>
      </div>
      <el-form ref="loginFromRef" :model="LoginFrom" :rules="rules" label-width="0px" class="login_from">
        <el-form-item prop="username">
          <el-input prefix-icon="el-icon-user" v-model="LoginFrom.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-lock" v-model="LoginFrom.password" type="password"></el-input>
        </el-form-item>
        <el-form-item class="bnts">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// import { postLogin ,getHomeMultidata} from "../network/login"; //导入首页需要请求的数据axios请求
export default {
  data() {
    return {
      LoginFrom : {
        username:'admin',
        password:'123456',
      },
      rules :{
        username :[
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12 的用户名', trigger: 'blur' }
        ],
        password:[
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 的密码', trigger: 'blur' }
        ]
      }
    };
  },
  methods:{
    //点击重置登录表单
    reset(){
      this.$refs.loginFromRef.resetFields()
    },
    login(){
      this.$refs.loginFromRef.validate(valid =>{  //async
        // console.log(valid);
        if(!valid) return;  //如果校验失败，则return
        // const {data : res} = await this.$http.post('login', this.LoginFrom)
        // console.log(res);
        
        this.$http.post('login', this.LoginFrom).then(res =>{
          console.log(res.data);
          if (res.data.meta.status !== 200) return this.$message.error('登录失败！')
          this.$message.success('登录成功')
          window.sessionStorage.setItem("token",res.data.data.token);//把获取的token值保存到客户端
          this.$router.push('./home')
        })
        
        




        // //   if(res.meta.status === 400) return this.$message.error('登录失败')
        // //   this.$message.success('登录成功');
        // //   //登录成功后，将token保存到客户端sessionStorage中
        // //   //项目中，其他api接口，必须在登录中后才能访问
        // //   //token只在当前网站打开期间生效，所以将TOKEN保存在sessionStorage中
        // //   //通过编程式导航跳转到后台主页，路由地址是/home

      })
    }
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  //生命周期 - 挂载完成（访问DOM元素）
  mounted() {}
};
</script>
<style lang="less" scoped>
/* @import url(); 引入css类 */
.login_container {
  background: url(../assets/img/login-background.f9f49138.jpg);
  background-size: cover ;
  height: 100vh;
  .login_box {
    width: 450px;
    height: 300px;
    background: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 10px;
    .title {
      margin: 50px 0 0 0;
      text-align: center;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .login_from{
      position: absolute;
      bottom: 0;
      box-sizing: border-box;
      padding: 0 20px;
      width: 100%;
      .bnts{
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>