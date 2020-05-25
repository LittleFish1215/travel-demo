<template>
  <div>
    <Row type="flex" align="middle">
      <i-col class="overtext" span="18" ref="content">{{row.content}}</i-col>
      <i-col span="6" v-show="show">
        <a @click="more()" style="padding-left:6px;">更多>></a>
      </i-col>
    </Row>
  </div>
</template>

<script>
export default {
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    row (newval, oldval) {
      this.$nextTick(() => {
        const elem = this.$refs.content.$el
        if (elem.clientHeight > 42) {
          this.show = true
        } else {
          this.show = false
        }
      })
    }
  },
  data () {
    return {
      show: false
    }
  },
  methods: {
    more () {
      this.$Modal.info({
        title: '详情',
        // content: JSON.stringify(this.row.param),
        render: (h, params) => {
          return h('Input', {
            props: {
              // disabled: true,
              type: 'textarea',
              value: JSON.stringify(this.row.content, null, 2),
              rows: 16
            }
          })
        }
      })
    }
  }
}
</script>
