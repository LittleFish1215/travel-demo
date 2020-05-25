<template>
  <div>
    <Modal
      v-model="showStatus"
      :title="(!isEdit ?'添加':'编辑') + '资源信息'"
      @on-ok="ok"
      @on-cancel="cancel"
      :loading="loading"
    >
      <Form :model="localItem" :label-width="80" :rules="ruleValidate" ref="table">
        <FormItem label="资源名称" prop="name">
          <Input v-model="localItem.name" placeholder="请输入资源名称"></Input>
        </FormItem>
        <FormItem label="资源路径" prop="path">
          <Input v-model="localItem.path" placeholder="请输入资源路径"></Input>
        </FormItem>
        <FormItem label="请求类型" prop="method">
          <Select v-model="localItem.method" style="width:200px">
            <Option value="post">POST</Option>
            <Option value="get">GET</Option>
            <Option value="delete">DELETE</Option>
            <Option value="update">UPDATE</Option>
          </Select>
        </FormItem>
        <FormItem label="资源类型" prop="type">
          <Select v-model="localItem.type" style="width:200px">
            <Option value="api">接口</Option>
            <Option value="btn">按钮</Option>
          </Select>
        </FormItem>
        <FormItem label="资源描述">
          <Input type="textarea" v-model="localItem.regmark" placeholder="请输入资源描述"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
export default {
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    isShow: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: () => {}
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
      localItem: {
        name: '',
        path: '',
        method: '',
        type: '',
        regmark: ''
      },
      ruleValidate: {
        name: [{ required: true, message: '请输入资源名称', trigger: 'blur' }],
        path: [{ required: true, message: '请输入资源路径', trigger: 'blur' }],
        method: [
          { required: true, message: '请选择请求方式', trigger: 'blur' }
        ],
        type: [{ required: true, message: '请选择资源类型', trigger: 'blur' }]
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
          this.$Message.info('添加成功！')
        } else {
          this.loading = false
          this.$nextTick(() => (this.loading = true))
          this.$Message.error('请检查输入数据')
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
