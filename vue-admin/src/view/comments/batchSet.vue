<template>
  <div>
    <Modal v-model="showStatus" title="批量设置" @on-ok="ok" @on-cancel="cancel">
      <Form :model="localItem" :label-width="80" ref="table">
        <FormItem label="是否显示">
          <RadioGroup v-model="localItem.status">
            <Radio label>不设置</Radio>
            <Radio label="0">否</Radio>
            <Radio label="1">是</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="用户禁言">
          <RadioGroup v-model="localItem.forbid">
            <Radio label>不设置</Radio>
            <Radio label="0">否</Radio>
            <Radio label="1">是</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="选择用户" v-if="localItem.forbid === '1'">
          <Select v-model="localItem.users" multiple>
            <Option v-for="(value,key) in users" :value="key+''" :key="key">{{ value }}</Option>
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
    },
    users: {
      type: Object,
      default: () => []
    }
  },
  watch: {
    isShow () {
      this.showStatus = this.isShow
    },
    users () {
      const arr = []
      for (const item in this.users) {
        arr.push(item)
      }
      this.localItem.users = arr
    }
  },
  data () {
    return {
      showStatus: false,
      localItem: {
        status: '',
        forbid: '',
        users: []
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
