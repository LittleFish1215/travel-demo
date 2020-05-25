<template>
  <div>
    <Modal v-model="showStatus" title="编辑景点属性" @on-ok="ok" @on-cancel="cancel" :loading="loading">
      <Form :model="localItem" :rules="rules" :label-width="80" ref="table">
        <FormItem label="评价内容" prop="content">
          <Input v-model="localItem.content" placeholder="请输入评价内容" type="textarea"></Input>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
export default {
  props: {
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
      localItem: {
        tid: {
          name: ''
        },
        cuid: {
          name: ''
        },
        content: ''
      },
      rules: {
        name: [{ required: true, message: '名称不得为空！', trigger: 'blur' }],
        address: [{ required: true, message: '地址不得为空！', trigger: 'blur' }]
      }
    }
  },
  methods: {
    ok () {
      this.$refs.table.validate((valid) => {
        if (valid) {
          this.loading = false
          this.$emit('changeEvent', false)
          this.$emit('editEvent', this.localItem)
          this.$Message.info('编辑成功！')
        } else {
          this.loading = false
          this.$nextTick(() => (this.loading = true))
          this.$Message.error('请检查输入数据')
        }
      })
    },
    cancel () {
      this.$emit('changeEvent', false)
      this.$Message.info('取消编辑！')
    }
  }
}
</script>
