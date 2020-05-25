<style lang="less">
@import './login.less';
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form :loading="loading" @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip">欢迎来到石家庄领养日社区</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
export default {
  components: {
    LoginForm
  },
  data () {
    return {
      loading: false
    }
  },
  methods: {
    ...mapActions(['handleLogin', 'getUserInfo']),
    handleSubmit (options) {
      this.loading = true
      this.handleLogin(options).then((res) => {
        this.loading = false
        if (res.code === 200) {
          this.$router.push({
            name: this.$config.homeName
          })
        } else {
          this.$Message.error(res.message)
        }
      })
    }
  }
}
</script>

<style>
</style>
