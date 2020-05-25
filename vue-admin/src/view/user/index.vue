<template>
  <div>
    <Card>
      <tables
        ref="tables"
        searchable
        searchPlace="top"
        :columns="columns"
        v-model="tableData"
        @on-row-edit="handleRowEdit"
        @on-row-remove="handleRowRemove"
        @on-selection-change="handleSelect"
        @searchEvent="handleSearch"
      >
        <template v-slot:table-header>
          <Button type="primary" class="search-btn" @click="handleAddUser">
            <Icon type="md-person-add" />新增用户
          </Button>
        </template>
      </tables>
      <Row type="flex" justify="space-between" align="middle">
        <Col class="ctrls">
          <Button @click="handleBatchDel">批量删除</Button>
          <Button style="margin: 10px 0;" type="primary">
            <Icon type="md-download" />导出表格
          </Button>
        </Col>
        <Col>
          <Page
            :total="total"
            show-sizer
            show-elevator
            show-total
            @on-change="handlePageChange"
            @on-page-size-change="handlePageSizeChange"
          />
        </Col>
      </Row>
    </Card>
    <edit-model
      :isShow="showEdit"
      :roles="roles"
      :item="currentItem"
      @editEvent="handleItemEdit"
      @changeEvent="handleChangeEvent"
    ></edit-model>
    <AddModel :isShow="showAdd" :roles="roles" @changeEvent="handleAddChangeEvent" @editEvent="handleItemAdd"></AddModel>
  </div>
</template>

<script>
import Tables from '_c/tables/index'
import EditModel from './Edit'
import AddModel from './Add'
import {
  getUserList,
  deleteUserById,
  updateUserById,
  addUser,
  getRoleNames
} from '../../api/admin'
import dayjs from 'dayjs'
export default {
  components: {
    Tables,
    EditModel,
    AddModel
  },
  data () {
    return {
      page: 1,
      limit: 10,
      total: 0,
      roles: [],
      option: {},
      showEdit: false,
      showAdd: false,
      showSet: false,
      currentIndex: 0,
      currentItem: {},
      selection: [],
      tableData: [],
      pageArr: [10, 20, 30, 50, 100],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
          hidden: true
        },
        {
          title: '用户昵称',
          minWidth: 140,
          align: 'center',
          key: 'name',
          search: {
            type: 'input'
          }
        },
        {
          title: '登录名',
          minWidth: 140,
          align: 'center',
          key: 'username',
          search: {
            type: 'input'
          }
        },
        {
          title: '所在城市',
          minWidth: 140,
          align: 'center',
          key: 'location',
          search: {
            type: 'input'
          }
        },
        {
          title: '个性签名',
          minWidth: 140,
          align: 'center',
          key: 'regmark',
          hidden: true,
          search: {
            type: 'input'
          }
        },
        {
          title: '角色权限',
          minWidth: 160,
          align: 'center',
          key: 'roles',
          render: (h, params) => {
            const roleNames = params.row.roles
              .map((o) => this.roleNames[o])
              .join(',')
            return h('div', [h('span', roleNames)])
          },
          search: {
            type: 'select',
            options: [
              {
                key: '超级管理员',
                value: 'super_admin'
              },
              {
                key: '管理员',
                value: 'admin'
              },
              {
                key: '普通用户',
                value: 'user'
              }
            ]
          }
        },
        {
          title: '创建时间',
          key: 'created',
          align: 'center',
          minWidth: 180,
          render (h, params) {
            return h('div', [
              h('span', dayjs(params.row.created).format('YYYY-MM-DD HH:mm:ss'))
            ])
          },
          sortable: true,
          search: {
            type: 'date'
          }
        },
        {
          title: '设置',
          slot: 'action',
          key: 'settings',
          align: 'center',
          hidden: true,
          fixed: 'right',
          width: 100
        }
      ]
    }
  },
  computed: {
    roleNames () {
      const tmp = {}
      this.roles.forEach((item) => {
        tmp[item.role] = item.name
      })
      return tmp
    }
  },
  methods: {
    // 添加用户事件
    handleItemAdd (item) {
      addUser(item).then(res => {
        if (res.code === 200) {
          this.$Message.info('添加新用户成功!')
          this.tableData.splice(0, 0, res.data)
        } else {
          this.$Message.error('检查输入数据!')
        }
      })
    },
    // 点击新增用户事件
    handleAddUser () {
      this.showAdd = true
    },
    // 改变AddModal的显隐
    handleAddChangeEvent (boolean) {
      this.showAdd = boolean
    },
    // 编辑用户信息事件
    handleItemEdit (item) {
      updateUserById(item)
        .then((res) => {
          if (res.code === 200) {
            this.$Message.success('更新用户信息成功')
            // this.tableData.splice(this.currentIndex, 1, item)
            this._getList()
          } else {
            this.$Message.error('请检查输入数据')
          }
        })
      this.showEdit = false
    },
    // 改变EditModal的显隐
    handleChangeEvent (value) {
      this.showEdit = value
    },
    handlePageChange (val) {
      this.page = val
      this._getList()
    },
    handlePageSizeChange (size) {
      this.limit = size
      this._getList()
    },
    handleSearch (value) {
      if (
        (typeof this.option.search !== 'undefined' &&
          value.search !== this.option.search) ||
        this.option === {}
      ) {
        this.page = 1 // 从1开始
      }
      this.option = value
      this._getList()
    },
    handleSelect (selection) {
      this.selection = selection
    },
    handleBatchDel () {
      if (this.selection.length === 0) {
        this.$Message.error('请选择要删除的数据!')
        return false
      }
      const msg = this.selection.map((o) => o.username).join(',')
      this.$Modal.confirm({
        title: '确定批量删除用户吗？',
        content: `删除登录名为${msg}的用户`,
        onOk: () => {
          const arr = this.selection.map((o) => o._id)
          deleteUserById(arr).then((res) => {
            // this.tableData.filter((item) => !arr.includes(item._id))
            this.$Message.info('删除成功!')
            this._getList()
          })
        },
        onCancel: () => {
          this.$Message.info('取消操作')
        }
      })
    },
    // 删除某一行数据的回调函数
    handleRowRemove (row, index) {
      this.$Modal.confirm({
        title: '确定删除用户吗？',
        content: `删除名为${row.name}的用户`,
        onOk: () => {
          deleteUserById(row._id).then((res) => {
            // this.tableData.splice(index, 1)
            this._getList()
            this.$Message.info('删除成功!')
          })
        },
        onCancel: () => {
          this.$Message.info('取消操作')
        }
      })
    },
    // 编辑某一行数据的回调函数
    handleRowEdit (row, index) {
      this.showEdit = true
      this.currentIndex = index
      this.currentItem = { ...row }
    },
    // 请求用户列表
    async _getList () {
      const res = await getUserList({
        page: this.page - 1,
        limit: this.limit,
        option: this.option
      })
      this.tableData = res.data
      this.total = res.total
    },

    // 获取用户角色名称
    async _getRoleNames () {
      const res = await getRoleNames()
      if (res.code === 200) {
        this.roles = res.data
      }
    }
  },
  // 在页面加载完以后请求数据
  mounted () {
    this._getList()
    this._getRoleNames()
  }
}
</script>

<style lang="scss" scoped>
.ctrls button {
  margin-right: 10px;
}
</style>
