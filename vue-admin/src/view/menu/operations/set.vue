<template>
  <div>
    <Modal v-model="showStatus" title="批量设置" @on-ok="ok" @on-cancel="cancel">
      <Form :model="localItem" :label-width="80" ref="table">
        <FormItem label="请求类型">
          <Select v-model="localItem.method" style="width:200px">
            <Option value="post">POST</Option>
            <Option value="get">GET</Option>
            <Option value="delete">DELETE</Option>
            <Option value="update">UPDATE</Option>
          </Select>
        </FormItem>
        <FormItem label="资源类型">
          <Select v-model="localItem.type" style="width:200px">
            <Option value="api">接口</Option>
            <Option value="btn">按钮</Option>
          </Select>
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
    }
  },
  watch: {
    isShow () {
      this.showStatus = this.isShow
    }
  },
  data () {
    return {
      showStatus: false,
      localItem: {
        method: '',
        type: ''
      }
    }
  },
  methods: {
    ok () {
      // this.$refs.table.resetFields()
      this.$emit('changeEvent', false)
      const result = {}
      for (var key of Object.keys(this.localItem)) {
        if (this.localItem[key] !== '') {
          result[key] = this.localItem[key]
        }
      }
      this.$emit('editEvent', result)
      this.$Message.info('设置成功！')
    },
    cancel () {
      this.$refs.table.resetFields()
      this.$emit('changeEvent', false)
      this.$Message.info('取消设置！')
    }
  }
}
</script>
