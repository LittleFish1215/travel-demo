<template>
  <div>
    <Card>
      <tables
        ref="tables"
        searchable
        search-place="top"
        v-model="tableData"
        :columns="columns"
        @on-row-edit="handleRowEdit"
        @on-row-remove="handleRowRemove"
        @on-selection-change="handleSelect"
        @searchEvent="handleSearch"
      />
      <Row type="flex" justify="space-between" align="middle">
        <Col class="ctrls">
          <Button @click="handleDeleteBatch()">批量删除</Button>
          <Button style="margin: 10px 0;" type="primary" @click="exportExcel">
            <Icon type="md-download"></Icon>导出表格
          </Button>
        </Col>
        <Page
          :total="total"
          :current="page"
          :page-size="limit"
          :page-size-opts="pageArr"
          show-elevator
          show-sizer
          show-total
          @on-change="onPageChange"
          @on-page-size-change="onPageSizeChange"
        />
      </Row>
    </Card>
    <EditModel
      :isShow="showEdit"
      :item="currentItem"
      @editEvent="handleItemEdit"
      @changeEvent="handleChangeEvent"
    ></EditModel>
  </div>
</template>

<script>
import Tables from '_c/tables'
import EditModel from './index/edit'
import {
  getNotesList,
  deleteNoteById,
  updateNoteById
} from '@/api/note'
import dayjs from 'dayjs'
export default {
  name: 'hotel_management',
  components: {
    Tables,
    EditModel
  },
  data () {
    return {
      page: 1,
      limit: 10,
      total: 0,
      option: {},
      showEdit: false,
      showSet: false,
      currentIndex: 0,
      currentItem: {},
      selection: [],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
          hidden: true
        },
        {
          title: '游记标题',
          key: 'title',
          minWidth: 200,
          ellipsis: true,
          align: 'center',
          search: {
            type: 'input'
          }
        },
        {
          title: '游记内容',
          key: 'content',
          minWidth: 400,
          ellipsis: true,
          align: 'center',
          search: {
            type: 'input'
          }
        },
        {
          title: '游记收藏数',
          key: 'collect',
          minWidth: 200,
          ellipsis: true,
          align: 'center',
          hidden: true,
          search: {
            type: 'input'
          }
        },
        {
          title: '游记点赞数',
          key: 'hands',
          minWidth: 200,
          ellipsis: true,
          align: 'center',
          hidden: true,
          search: {
            type: 'input'
          }
        },
        {
          title: '创建时间',
          key: 'created',
          width: 200,
          align: 'center',
          // 方法二：使用 render 方法结构化数据
          render: (h, params) => {
            return h('div', [
              h('span', dayjs(params.row.created).format('YYYY-MM-DD HH:mm:ss'))
            ])
          },
          search: {
            type: 'date'
          }
        },
        {
          title: '设置',
          key: 'settings',
          slot: 'action',
          width: 160,
          align: 'center',
          hidden: true
        }
      ],
      pageArr: [10, 20, 30, 50, 100],
      tableData: []
    }
  },
  methods: {
    // 批量删除
    handleDeleteBatch () {
      // 批量进行删除
      if (this.selection.length === 0) {
        this.$Message.info('请选择需要删除的数据！')
        return
      }
      const msg = this.selection.map((o) => o.title).join(',')
      this.$Modal.confirm({
        title: '确定删除吗？',
        content: `删除${msg}吗？`,
        onOk: () => {
          const arr = this.selection.map((o) => o._id)
          deleteNoteById(arr).then((res) => {
            this.tableData = this.tableData.filter(
              (item) => !arr.includes(item._id)
            )
            this.$Message.success('删除成功！')
            this._getList()
          })
        },
        onCancel: () => {
          this.$Message.info('取消操作！')
        }
      })
    },
    // 选中事件
    handleSelect (selection) {
      this.selection = selection
    },
    // 改变事件
    handleChangeEvent (value) {
      this.showEdit = value
    },
    // 改变选中项
    handleSetChangeEvent (value) {
      this.showSet = value
    },
    // 编辑某一行数据
    handleItemEdit (item) {
      updateNoteById(item).then((res) => {
        if (res.code === 200) {
          this.tableData.splice(this.currentIndex, 1, item)
        }
      })
      this.showEdit = false
    },
    // 编辑某一行数据
    handleRowEdit (row, index) {
      this.showEdit = true
      this.currentIndex = index
      this.currentItem = { ...row }
    },
    // 删除某一行数据
    handleRowRemove (row, index) {
      this.$Modal.confirm({
        title: '确定删除文章吗？',
        content: `删除第${index + 1}条数据，"${row.title}"吗`,
        onOk: () => {
          deleteNoteById(row._id)
            .then((res) => {
              if (res.code === 200) {
                this.$Message.info(res.message)
                this._getList()
              }
            })
            .catch((err) => {
              this.$Message.info('删除失败！原因：' + err)
            })
        },
        onCancel: () => {
          this.$Message.info('取消操作！')
        }
      })
    },
    // 搜索事件
    handleSearch (value) {
      this.option = {}
      this.page = 1
      if (value.item === 'created') {
        this.option.start = value.search[0]
        this.option.end = value.search[1]
      }
      this.option[value.item] = value.search
      this._getList()
    },
    // 导出
    exportExcel () {
      this.$refs.tables.exportCsv({
        filename: `table-${new Date().valueOf()}.csv`
      })
    },
    // 分页改变
    onPageChange (page) {
      this.page = page
      this._getList()
    },
    // 条数改变
    onPageSizeChange (size) {
      this.limit = size
      this._getList()
    },
    _getList () {
      getNotesList({
        page: this.page - 1,
        limit: this.limit,
        ...this.option
      }).then((res) => {
        this.tableData = res.data
        this.total = res.total
      })
    }
  },
  mounted () {
    this._getList()
  }
}
</script>

<style lang="scss" scoped>
.ctrls {
  button {
    margin-right: 10px;
  }
}
</style>
