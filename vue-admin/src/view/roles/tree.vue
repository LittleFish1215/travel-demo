<template>
  <div>
    <i-row type="flex" align="middle" justify="center">
      <ButtonGroup class="imooc-btn-group" :class="{'editing': isEdit}">
        <Button size="small" :disabled="isEdit" icon="md-add" @click="addMenu()">新增</Button>
        <Button
          size="small"
          icon="ios-create"
          type="primary"
          @click="editMenu()"
          :disabled="isEdit"
        >修改</Button>
        <Button
          size="small"
          icon="md-trash"
          type="error"
          @click="deleteMenu()"
          :disabled="isEdit"
        >删除</Button>
      </ButtonGroup>
    </i-row>
    <Tree :data="menuData" ref="tree" @on-select-change="handleTreeChange"></Tree>
  </div>
</template>

<script>
export default {
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    menu: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      selectNode: []
    }
  },
  methods: {
    addMenu (type) {
      if (this.selectNode.length > 0 || this.menuData.length === 0) {
        this.$emit('addMenuEvent', type)
      } else {
        this.$Message.error('请选择菜单节点后再添加！')
      }
    },
    editMenu () {
      if (this.selectNode.length > 0) {
        this.$emit('editMenuEvent', { ...this.selectNode[0] })
      } else {
        this.$Message.error('请选择菜单节点后再编辑！')
      }
    },
    handleTreeChange (item) {
      this.selectNode = item
      this.$emit('on-select', item)
    },
    deleteMenu () {
      if (this.selectNode.length > 0 || this.menuData.length === 0) {
        this.$Modal.confirm({
          title: '确定删除吗？',
          content: `删除${this.selectNode[0].title}的菜单项吗？`,
          onOk: () => {
            this.$emit('deleteMenuEvent', this.selectNode[0])
            this.selectNode = []
          }
        })
      } else {
        this.$Message.error('请选择菜单节点后再进行删除！')
      }
    }
  },
  computed: {
    menuData () {
      return this.menu
    }
  }
}
</script>

<style lang="scss">
@media screen and (max-width: 1200px) {
  .imooc-btn-group {
    .ivu-icon {
      & + span {
        display: none;
      }
    }
    .imooc-dropdown {
      display: none;
    }
  }
}
.imooc-btn-group {
  .ivu-icon {
    & + span {
      margin-left: 0;
    }
  }
  &.editing {
    a {
      color: #dcdee2;
    }
    .ivu-btn-primary {
      border-color: #dcdee2 !important;
    }
    button:first-child {
      border-right: 0;
    }
  }
}
</style>
