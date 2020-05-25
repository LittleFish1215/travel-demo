<template>
  <div>
    <Row :gutter="10">
      <i-col span="6" :sm="24" :md="9" :lg="6">
        <Card :dis-hover="true" :shadow="true">
          <TreeMenu
            :isEdit="isEdit"
            :menu="menuData"
            @addMenuEvent="addMenu"
            @editMenuEvent="editMenu"
            @deleteMenuEvent="deleteMenu"
            @on-select="handleTreeChange"
          ></TreeMenu>
        </Card>
      </i-col>
      <i-col span="18" :sm="24" :md="15" :lg="18">
        <Card
          :title="$t('Menu Options')"
          icon="ios-options"
          :dis-hover="true"
          :shadow="true"
          style="margin-bottom: 10px;"
        >
          <MenuForm
            :formData="formData"
            :isEdit="isEdit"
            :selectNode="selectNode"
            @cancel="initForm"
            @submit="submit"
          ></MenuForm>
        </Card>
        <Card :title="$t('resources')" :dis-hover="true" :shadow="true">
          <OperationsTable
            :columns="columns"
            :tableData="tableData"
            :isEdit="isEdit"
            @on-change="handleTableChange"
          ></OperationsTable>
        </Card>
      </i-col>
    </Row>
  </div>
</template>

<script>
import TreeMenu from './tree.vue'
import MenuForm from './form.vue'
import OperationsTable from './operations.vue'
import {
  sortObj,
  updateNode,
  insertNode,
  deleteNode,
  getNode,
  sortMenus
} from '@/libs/util'
import { getMenu, updateMenu, deleteMenu, addMenu } from '@/api/admin'
export default {
  components: {
    TreeMenu,
    MenuForm,
    OperationsTable
  },
  data () {
    return {
      isEdit: false,
      type: '',
      selectNode: [],
      menuData: [],
      formData: {
        title: '',
        name: '', // 组件名称
        path: '',
        component: '',
        hideInBread: false,
        hideInMenu: false,
        notCache: false,
        icon: '',
        sort: 0,
        redirect: '',
        type: 'menu',
        link: '',
        operations: []
      },
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
          hidden: true
        },
        {
          title: '资源名称',
          key: 'name',
          search: {
            type: 'input'
          },
          align: 'center'
        },
        {
          title: '资源路径',
          key: 'path',
          search: {
            type: 'input'
          },
          align: 'center'
        },
        {
          title: '请求类型',
          key: 'method',
          search: {
            type: 'input'
          },
          align: 'center',
          render: (h, params) => {
            return h('div', params.row.method.toUpperCase())
          }
        },
        {
          title: '资源类型',
          key: 'type',
          search: {
            type: 'radio',
            options: [
              {
                key: '全部',
                value: ''
              },
              {
                key: '接口',
                value: 'api'
              },
              {
                key: '按钮',
                value: 'btn'
              }
            ]
          },
          align: 'center'
        },
        {
          title: '资源描述',
          key: 'regmark',
          search: {
            type: 'input'
          }
        },
        {
          title: '设置',
          key: 'settings',
          slot: 'action',
          hidden: true,
          fixed: 'right',
          width: 100,
          align: 'center'
        }
      ],
      tableData: []
    }
  },
  mounted () {
    this._getMenu()
  },
  methods: {
    _getMenu () {
      getMenu().then((res) => {
        if (res.code === 200) {
          this.menuData = res.data
        }
      })
    },
    handleTreeChange (item) {
      if (item.length === 0) {
        return
      }
      // 非编辑状态
      if (!this.isEdit) {
        this.selectNode = item
        this.formData = item[0]
        // if (item[0].operations && item[0].operations.length > 0) {
        this.tableData = [...item[0].operations]
        // }
      } else {
        this.$Message.error('当前为编辑状态，请取消编辑后查看！')
      }
    },
    addMenu (type) {
      this.initForm()
      this.type = type
      this.isEdit = true
    },
    editMenu (select) {
      this.isEdit = true
      this.formData = select
    },
    deleteMenu (select) {
      if (!select) {
        return
      }
      // 判断是删除一级菜单 还是删除子菜单
      const parent = getNode(this.menuData, select)
      if (parent.nodeKey !== select.nodeKey) {
        // 删除子菜单
        updateMenu(parent).then((res) => {
          if (res.code === 200) {
            this.$Message.success('删除子菜单成功！')
          }
        })
      } else {
        deleteMenu({ _id: parent._id }).then((res) => {
          if (res.code === 200) {
            this.$Message.success('删除菜单成功！')
          }
        })
      }
      this.menuData = deleteNode(this.menuData, select)
    },
    submit (data) {
      let parent = getNode(this.menuData, this.selectNode[0])
      if (this.tableData.length > 0) {
        data.operations = this.tableData
      }
      // 1. 获取 formData中的数据 -> menuData中
      //   a. type -> 数据插入的节点
      //   b. 数据需要按照tree的数据格式进行格式化 -> title
      if (this.type === 'bro') {
        // 兄弟节点
        if (this.menuData.length === 0) {
          addMenu(data).then((res) => {
            if (res.code === 200) {
              this.menuData.push(res.data)
              this.$Message.success('添加菜单成功')
              this.menuData = sortMenus([...this.menuData])
              this.initForm()
            }
          })
        } else {
          const selectNode = this.selectNode[0]
          // 1. 可能是一级节点的兄弟节点  -> addMenu -> menu
          if (parent.nodeKey === selectNode.nodeKey) {
            addMenu(data).then((res) => {
              if (res.code === 200) {
                this.menuData = insertNode(this.menuData, selectNode, res.data)
                this.menuData = sortMenus([...this.menuData])
                this.$Message.success('添加菜单成功')
              }
            })
          } else {
            // 2. 可能是二级节点的兄弟节点 -> parent 一级节点 -> updateMenu
            parent = getNode(this.menuData, selectNode)
            updateMenu(parent).then((res) => {
              if (res.code === 200) {
                this.$Message.success('添加菜单成功')
                this.menuData = sortMenus([...this.menuData])
              }
            })
          }
          // this.selectNode.length > 0
        }
      } else if (this.type === 'child') {
        // 子节点
        if (typeof this.selectNode[0].children === 'undefined') {
          this.$set(this.selectNode[0], 'children', [data])
        } else {
          let arr = [...this.selectNode[0].children, data]
          arr = sortObj(arr, 'sort')
          // 排序？
          this.$set(this.selectNode[0], 'children', arr)
        }
        parent = getNode(this.menuData, this.selectNode[0])
        // 更新操作
        updateMenu(parent).then((res) => {
          if (res.code === 200) {
            this.menuData = sortMenus([...this.menuData])
            this.$Message.success('添加子菜单成功！')
          }
        })
      } else {
        // 更新菜单节点
        this.menuData = updateNode(this.menuData, data)
        this.$set(this.selectNode, 0, data)
        parent = getNode(this.menuData, this.selectNode[0])
        // 更新操作
        updateMenu(parent).then((res) => {
          if (res.code === 200) {
            this.menuData = sortMenus([...this.menuData])
            this.$Message.success('更新菜单成功！')
          }
        })
      }
    },
    initForm () {
      this.isEdit = false
      this.type = ''
      this.formData = {
        title: '',
        name: '', // 组件名称
        path: '',
        component: '',
        hideInBread: false,
        hideInMenu: false,
        notCache: false,
        icon: '',
        sort: 0,
        link: '',
        redirect: '',
        type: 'menu',
        operations: []
      }
      this.tableData = []
    },
    handleTableChange (table) {
      this.tableData = table
    }
  }
}
</script>

<style lang="scss">
</style>
