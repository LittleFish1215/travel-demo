<template>
  <div>
    <Modal v-model="showStatus" title="编辑用户信息" @on-ok="ok" @on-cancel="cancel" :loading="loading">
      <Form :model="localItem" :label-width="80" :rules="ruleValidate" ref="table">
        <FormItem label="用户昵称" prop="name">
          <Input v-model="localItem.name" placeholder="请输入用户昵称"></Input>
        </FormItem>
        <FormItem label="登录名" prop="username">
          <Input v-model="localItem.username" placeholder="请输入登录名"></Input>
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input v-model="localItem.password" placeholder="请输入密码" type="password"></Input>
        </FormItem>
        <FormItem label="城市" prop="location">
          <Input v-model="localItem.location" placeholder="请输入城市"></Input>
        </FormItem>
        <FormItem label="个签" prop="regmark">
          <Input v-model="localItem.regmark" placeholder="请输入个性签名"></Input>
        </FormItem>
        <FormItem label="手机号" prop="mobile">
          <Input v-model="localItem.mobile" placeholder="请输入手机号"></Input>
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
      </Form>
    </Modal>
  </div>
</template>
<script>
import { checkUsername } from '@/api/admin'
const userNamePassCheck = (rule, value, callback, vm) => {
  if (vm.item.username === vm.localItem.username) {
    callback()
    return
  }
  checkUsername(value).then((res) => {
    if (res.code === 200) {
      const { data } = res
      if (data === 1) {
        callback()
      } else if (data === 0) {
        callback(new Error('用户名冲突！请更换！'))
      }
    }
  })
}

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
      this.localItem = { ...newval }
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
      oldName: '',
      localItem: {
        _id: '',
        name: '',
        username: '',
        password: '',
        roles: [],
        location: '',
        mobile: ''
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
          {
            validator: (rule, value, callback) =>
              userNamePassCheck(rule, value, callback, this),
            trigger: 'blur'
          }
        ],
        roles: [{ validator: rolesCheck, trigger: 'blur' }],
        password: [
          // { required: true, message: '请输入密码', trigger: 'blur' },
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
        ]
      }
    }
  },
  mounted () {},
  methods: {
    ok () {
      this.$refs.table.validate((valid) => {
        if (valid) {
          this.loading = false
          // this.$refs.table.resetFields()
          this.$emit('changeEvent', false)
          this.$emit('editEvent', this.localItem)
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
