<template>
  <div>
    <Modal v-model="showStatus" title="添加用户信息" @on-ok="ok" @on-cancel="cancel" :loading="loading">
      <Form :model="localItem" :label-width="80" :rules="ruleValidate" ref="table">
        <FormItem label="登录名" prop="username">
          <Input prefix="md-mail" v-model="localItem.username" placeholder="请输入登录名"></Input>
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input prefix="md-lock" v-model="localItem.password" placeholder="请输入密码" type="password" password></Input>
        </FormItem>
        <FormItem label="角色" prop="roles">
          <Select v-model="localItem.roles" multiple>
            <Option
              v-for="(item,index) in roles"
              :value="item.role"
              :key="'roles-' + index"
            >{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="用户昵称" prop="name">
          <Input prefix="md-person" v-model="localItem.name" placeholder="请输入用户昵称"></Input>
        </FormItem>
        <FormItem label="手机" prop="mobile">
          <Input v-model="localItem.mobile" placeholder="请输入用户手机号"></Input>
        </FormItem>
        <FormItem label="所在城市" prop="location">
          <Input prefix="md-pin" v-model="localItem.location" placeholder="请输入用户所在城市"></Input>
        </FormItem>
        <FormItem label="性别" prop="gender">
          <RadioGroup v-model="localItem.gender">
            <Radio label="0">男</Radio>
            <Radio label="1">女</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="个性签名" prop="regmark">
          <Input type="textarea" v-model="localItem.regmark" placeholder="请输入用户个性签名"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { checkUsername } from '@/api/admin'
// 自定义校验用户名是否已存在的规则
const userNamePassCheck = (rule, value, callback) => {
  checkUsername(value).then((res) => {
    if (res.code === 200) {
      const { data } = res
      if (data === 1) {
        callback()
      } else {
        callback(new Error('用户名冲突！请更换！'))
      }
    }
  })
}
// 自定义校验手机号码格式
const mobileCheck = (rule, value, callback) => {
  if (/^1[3456789]\d{9}$/.test(value)) {
    callback()
  } else {
    callback(new Error('请检查手机格式！'))
  }
}
// 自定义校验是否设置了用户角色(权限)
const rolesCheck = (rule, value, callback) => {
  if (value.length === 0) {
    callback(new Error('请选择用户角色!'))
  } else {
    callback()
  }
}

export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: () => {}
    },
    roles: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    item (newval, oldval) {
      console.log(newval)
      this.localItem = newval
    },
    isShow () {
      this.showStatus = this.isShow
    }
  },
  data () {
    return {
      loading: true,
      showStatus: false,
      tagsList: [],
      localItem: {
        name: '',
        username: '',
        password: '',
        roles: ['user'],
        status: '0',
        favs: 100,
        gender: '0',
        location: '',
        mobile: '',
        regmark: '用户很懒，什么都没有留下~',
        isVip: '0'
      },
      ruleValidate: {
        name: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          {
            type: 'string',
            min: 4,
            message: '昵称长度至少为4位',
            trigger: 'change'
          },
          {
            type: 'string',
            max: 16,
            message: '昵称长度不能超过16位',
            trigger: 'change'
          }
        ],
        username: [
          { required: true, message: '请输入登录名', trigger: 'blur' },
          { type: 'email', message: '请检查邮箱格式', trigger: 'blur' },
          { validator: userNamePassCheck, trigger: 'blur' }
        ],
        roles: [{ validator: rolesCheck, trigger: 'blur' }],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            type: 'string',
            min: 6,
            message: '密码长度至少为6位',
            trigger: 'change'
          },
          {
            type: 'string',
            max: 20,
            message: '密码长度不能超过20位',
            trigger: 'change'
          }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: mobileCheck, trigger: 'blur' }]
      }
    }
  },
  mounted () {},
  methods: {
    ok () {
      this.$refs.table.validate((valid) => {
        if (valid) {
          this.loading = false
          this.$emit('changeEvent', false)
          this.$emit('editEvent', { ...this.localItem })
          setTimeout(() => {
            this.$refs.table.resetFields()
          }, 0)
        } else {
          this.loading = false
          this.$nextTick(() => (this.loading = true))
        }
      })
    },
    cancel () {
      this.$refs.table.resetFields()
      this.$emit('changeEvent', false)
      this.$Message.info('取消编辑！')
    }
  }
}
</script>
