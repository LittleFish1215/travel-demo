<template>
  <div>
    <Form :disabled="!isEdit" ref="form" :model="formData" :rules="formRules" :label-width="80">
      <FormItem label="菜单标题" prop="title">
        <i-input v-model="formData.title" placeholder="请输入菜单名称"></i-input>
      </FormItem>
      <FormItem label="路径" prop="path">
        <i-input v-model="formData.path" placeholder="请输入菜单路由"></i-input>
      </FormItem>
      <FormItem label="菜单类型">
        <Select v-model="formData.type" placeholder="请选择菜单类型">
          <Option value="menu">目录</Option>
          <Option value="resouce">资源</Option>
          <Option value="link">链接</Option>
        </Select>
      </FormItem>
      <template v-if="formData.type !== 'link'">
        <FormItem label="组件名称" prop="name">
          <i-input v-model="formData.name" placeholder="请输入组件名称"></i-input>
        </FormItem>
        <FormItem label="组件">
          <i-input v-model="formData.component" placeholder="请输入前端组件名称">
            <span slot="prepend">()=>import('@</span>
            <span slot="append">.vue')</span>
          </i-input>
        </FormItem>
        <FormItem label="面包屑">
          不显示
          <Switch v-model="formData.hideInBread" />显示
        </FormItem>
        <FormItem label="菜单显示">
          不显示
          <Switch v-model="formData.hideInMenu" />显示
        </FormItem>
        <FormItem label="页面缓存">
          是
          <!-- Method 1 -->
          <!-- <i-switch v-model="formData.notCache"></i-switch> -->
          <Switch v-model="formData.notCache" />否
        </FormItem>
      </template>
      <template v-else>
        <FormItem label="链接">
          <i-input v-model="formData.link" placeholder="请输入跳转链接"></i-input>
        </FormItem>
      </template>
      <FormItem label="排序">
        <i-input v-model="formData.sort" placeholder="组件默认排序"></i-input>
      </FormItem>
      <FormItem label="图标">
        <i-input v-model="formData.icon" placeholder="请输入前端组件名称"></i-input>
      </FormItem>
      <FormItem label="重定向">
        <i-input v-model="formData.redirect" placeholder="重定向组件"></i-input>
      </FormItem>
      <FormItem v-if="isEdit">
        <Button type="primary" @click="submit()">确定</Button>
        <Button style="margin-left: 8px" @click="cancel()">取消</Button>
      </FormItem>
    </Form>
  </div>
</template>

<script>
export default {
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      formRules: {
        title: [
          {
            required: true,
            message: '菜单名称不得为空',
            trigger: 'blur'
          }
        ],
        name: [
          {
            required: true,
            message: '组件名称不得为空',
            trigger: 'blur'
          }
        ],
        path: [
          {
            required: true,
            message: '路由路径不得为空',
            trigger: 'blur'
          }
        ],
        component: [
          {
            required: true,
            message: '前端组件不得为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    submit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 检验通过后的逻辑
          const data = {
            ...this.formData,
            expand: true
          }
          this.$emit('submit', data)
          // 恢复到默认状态
          this.initFields()
          // 2. 提交对应的数据到后台接口
        } else {
          this.$Message.error('请检验表单数据！')
        }
      })
    },
    cancel () {
      this.initFields()
    },
    initFields () {
      this.$emit('cancel')
      this.$refs.form.resetFields()
    },
    setMenu (data) {
      this.$emit('submit', data)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
