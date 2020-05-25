<template>
  <div>
    <Modal v-model="showStatus" title="编辑游记属性" @on-ok="ok" @on-cancel="cancel" :loading="loading">
      <Form :model="localItem" :rules="rules" :label-width="80" ref="table">
        <FormItem label="标题" prop="title">
          <Input v-model="localItem.title" placeholder="请输入游记标题"></Input>
        </FormItem>
        <FormItem label="内容" prop="content">
          <Input v-model="localItem.content" placeholder="请输入游记内容" type="textarea"></Input>
        </FormItem>
        <FormItem label="收藏数" prop="collect">
          <Input v-model="localItem.collect" placeholder="请输入游记收藏数"></Input>
        </FormItem>
        <FormItem label="点赞数" prop="hands">
          <Input v-model="localItem.hands" placeholder="请输入游记点赞数"></Input>
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
        title: '',
        content: '',
        collect: '',
        hands: ''
      },
      rules: {
        title: [{ required: true, message: '标题不得为空！', trigger: 'blur' }],
        content: [{ required: true, message: '内容不得为空！', trigger: 'blur' }]
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
