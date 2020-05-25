import Cookies from 'js-cookie'
// cookie保存的天数
import config from '@/config'
import { forEach, hasOneOf, objEqual } from '@/libs/tools'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'
const { title, cookieExpires, useI18n } = config

dayjs.extend(relativeTime)

export const TOKEN_KEY = 'token'

export const setToken = (token) => {
  Cookies.set(TOKEN_KEY, token, { expires: cookieExpires || 1 })
}

export const getToken = () => {
  const token = Cookies.get(TOKEN_KEY)
  if (token) return token
  else return false
}

export const hasChild = (item) => {
  return item.children && item.children.length !== 0
}

const showThisMenuEle = (item, access) => {
  if (item.meta && item.meta.access && item.meta.access.length) {
    if (hasOneOf(item.meta.access, access)) return true
    else return false
  } else return true
}
/**
 * @param {Array} list 通过路由列表得到菜单列表
 * @returns {Array}
 */
export const getMenuByRouter = (list, access) => {
  const res = []
  forEach(list, (item) => {
    if (!item.meta || (item.meta && !item.meta.hideInMenu)) {
      const obj = {
        icon: (item.meta && item.meta.icon) || '',
        name: item.name,
        meta: item.meta
      }
      if (
        (hasChild(item) || (item.meta && item.meta.showAlways)) &&
        showThisMenuEle(item, access)
      ) {
        obj.children = getMenuByRouter(item.children, access)
      }
      if (item.meta && item.meta.href) obj.href = item.meta.href
      if (showThisMenuEle(item, access)) res.push(obj)
    }
  })
  return res
}

/**
 * @param {Array} routeMetched 当前路由metched
 * @returns {Array}
 */
export const getBreadCrumbList = (route, homeRoute) => {
  const homeItem = { ...homeRoute, icon: homeRoute.meta.icon }
  const routeMetched = route.matched
  if (routeMetched.some((item) => item.name === homeRoute.name)) {
    return [homeItem]
  }
  let res = routeMetched
    .filter((item) => {
      return item.meta === undefined || !item.meta.hideInBread
    })
    .map((item) => {
      const meta = { ...item.meta }
      if (meta.title && typeof meta.title === 'function') {
        meta.__titleIsFunction__ = true
        meta.title = meta.title(route)
      }
      const obj = {
        icon: (item.meta && item.meta.icon) || '',
        name: item.name,
        meta: meta
      }
      return obj
    })
  res = res.filter((item) => {
    return !item.meta.hideInMenu
  })
  return [{ ...homeItem, to: homeRoute.path }, ...res]
}

export const getRouteTitleHandled = (route) => {
  const router = { ...route }
  const meta = { ...route.meta }
  let title = ''
  if (meta.title) {
    if (typeof meta.title === 'function') {
      meta.__titleIsFunction__ = true
      title = meta.title(router)
    } else title = meta.title
  }
  meta.title = title
  router.meta = meta
  return router
}

export const showTitle = (item, vm) => {
  let { title, __titleIsFunction__ } = item.meta
  if (!title) return
  if (useI18n) {
    if (title.includes('{{') && title.includes('}}') && useI18n) {
      title = title.replace(/({{[\s\S]+?}})/, (m, str) =>
        str.replace(/{{([\s\S]*)}}/, (m, _) => vm.$t(_.trim()))
      )
    } else if (__titleIsFunction__) {
      title = item.meta.title
    } else {
      title = vm.$t(item.name)
    }
  } else {
    title = (item.meta && item.meta.title) || item.name
  }
  return title
}

/**
 * @description 本地存储和获取标签导航列表
 */
export const setTagNavListInLocalstorage = (list) => {
  localStorage.tagNaveList = JSON.stringify(list)
}
/**
 * @returns {Array} 其中的每个元素只包含路由原信息中的name, path, meta三项
 */
export const getTagNavListFromLocalstorage = () => {
  const list = localStorage.tagNaveList
  return list ? JSON.parse(list) : []
}

/**
 * @param {Array} routers 路由列表数组
 * @description 用于找到路由列表中name为home的对象
 */
export const getHomeRoute = (routers, homeName = 'home') => {
  let i = -1
  const len = routers.length
  let homeRoute = {}
  while (++i < len) {
    const item = routers[i]
    if (item.children && item.children.length) {
      const res = getHomeRoute(item.children, homeName)
      if (res.name) return res
    } else {
      if (item.name === homeName) homeRoute = item
    }
  }
  return homeRoute
}

/**
 * @param {*} list 现有标签导航列表
 * @param {*} newRoute 新添加的路由原信息对象
 * @description 如果该newRoute已经存在则不再添加
 */
export const getNewTagList = (list, newRoute) => {
  const { name, path, meta } = newRoute
  const newList = [...list]
  if (newList.findIndex((item) => item.name === name) >= 0) return newList
  else newList.push({ name, path, meta })
  return newList
}

/**
 * @param {*} access 用户权限数组，如 ['super_admin', 'admin']
 * @param {*} route 路由列表
 */
const hasAccess = (access, route) => {
  if (route.meta && route.meta.access) {
    return hasOneOf(access, route.meta.access)
  } else return true
}

/**
 * 权鉴
 * @param {*} name 即将跳转的路由name
 * @param {*} access 用户权限数组
 * @param {*} routes 路由列表
 * @description 用户是否可跳转到该页
 */
export const canTurnTo = (name, access, routes) => {
  const routePermissionJudge = (list) => {
    return list.some((item) => {
      if (item.children && item.children.length) {
        return routePermissionJudge(item.children)
      } else if (item.name === name) {
        return hasAccess(access, item)
      }
    })
  }

  return routePermissionJudge(routes)
}

/**
 * @param {String} url
 * @description 从URL中解析参数
 */
export const getParams = (url) => {
  const keyValueArr = url.split('?')[1].split('&')
  const paramObj = {}
  keyValueArr.forEach((item) => {
    const keyValue = item.split('=')
    paramObj[keyValue[0]] = keyValue[1]
  })
  return paramObj
}

/**
 * @param {Array} list 标签列表
 * @param {String} name 当前关闭的标签的name
 */
export const getNextRoute = (list, route) => {
  let res = {}
  if (list.length === 2) {
    res = getHomeRoute(list)
  } else {
    const index = list.findIndex((item) => routeEqual(item, route))
    if (index === list.length - 1) res = list[list.length - 2]
    else res = list[index + 1]
  }
  return res
}

/**
 * @param {Number} times 回调函数需要执行的次数
 * @param {Function} callback 回调函数
 */
export const doCustomTimes = (times, callback) => {
  let i = -1
  while (++i < times) {
    callback(i)
  }
}

/**
 * @param {Object} file 从上传组件得到的文件对象
 * @returns {Promise} resolve参数是解析后的二维数组
 * @description 从Csv文件中解析出表格，解析成二维数组
 */
export const getArrayFromFile = (file) => {
  const nameSplit = file.name.split('.')
  const format = nameSplit[nameSplit.length - 1]
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsText(file) // 以文本格式读取
    let arr = []
    reader.onload = function (evt) {
      const data = evt.target.result // 读到的数据
      const pasteData = data.trim()
      arr = pasteData
        .split(/[\n\u0085\u2028\u2029]|\r\n?/g)
        .map((row) => {
          return row.split('\t')
        })
        .map((item) => {
          return item[0].split(',')
        })
      if (format === 'csv') resolve(arr)
      else reject(new Error('[Format Error]:你上传的不是Csv文件'))
    }
  })
}

/**
 * @param {Array} array 表格数据二维数组
 * @returns {Object} { columns, tableData }
 * @description 从二维数组中获取表头和表格数据，将第一行作为表头，用于在iView的表格中展示数据
 */
export const getTableDataFromArray = (array) => {
  let columns = []
  let tableData = []
  if (array.length > 1) {
    const titles = array.shift()
    columns = titles.map((item) => {
      return {
        title: item,
        key: item
      }
    })
    tableData = array.map((item) => {
      const res = {}
      item.forEach((col, i) => {
        res[titles[i]] = col
      })
      return res
    })
  }
  return {
    columns,
    tableData
  }
}

export const findNodeUpper = (ele, tag) => {
  if (ele.parentNode) {
    if (ele.parentNode.tagName === tag.toUpperCase()) {
      return ele.parentNode
    } else {
      return findNodeUpper(ele.parentNode, tag)
    }
  }
}

export const findNodeUpperByClasses = (ele, classes) => {
  const parentNode = ele.parentNode
  if (parentNode) {
    const classList = parentNode.classList
    if (
      classList &&
      classes.every((className) => classList.contains(className))
    ) {
      return parentNode
    } else {
      return findNodeUpperByClasses(parentNode, classes)
    }
  }
}

export const findNodeDownward = (ele, tag) => {
  const tagName = tag.toUpperCase()
  if (ele.childNodes.length) {
    let i = -1
    const len = ele.childNodes.length
    while (++i < len) {
      const child = ele.childNodes[i]
      if (child.tagName === tagName) return child
      else return findNodeDownward(child, tag)
    }
  }
}

export const showByAccess = (access, canViewAccess) => {
  return hasOneOf(canViewAccess, access)
}

/**
 * @description 根据name/params/query判断两个路由对象是否相等
 * @param {*} route1 路由对象
 * @param {*} route2 路由对象
 */
export const routeEqual = (route1, route2) => {
  const params1 = route1.params || {}
  const params2 = route2.params || {}
  const query1 = route1.query || {}
  const query2 = route2.query || {}
  return (
    route1.name === route2.name &&
    objEqual(params1, params2) &&
    objEqual(query1, query2)
  )
}

/**
 * 判断打开的标签列表里是否已存在这个新添加的路由对象
 */
export const routeHasExist = (tagNavList, routeItem) => {
  const len = tagNavList.length
  let res = false
  doCustomTimes(len, (index) => {
    if (routeEqual(tagNavList[index], routeItem)) res = true
  })
  return res
}

export const localSave = (key, value) => {
  localStorage.setItem(key, value)
}

export const localRead = (key) => {
  return localStorage.getItem(key) || ''
}

// scrollTop animation
export const scrollTop = (el, from = 0, to, duration = 500, endCallback) => {
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame =
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function (callback) {
        return window.setTimeout(callback, 1000 / 60)
      }
  }
  const difference = Math.abs(from - to)
  const step = Math.ceil((difference / duration) * 50)

  const scroll = (start, end, step) => {
    if (start === end) {
      endCallback && endCallback()
      return
    }

    let d = start + step > end ? end : start + step
    if (start > end) {
      d = start - step < end ? end : start - step
    }

    if (el === window) {
      window.scrollTo(d, d)
    } else {
      el.scrollTop = d
    }
    window.requestAnimationFrame(() => scroll(d, end, step))
  }
  scroll(from, to, step)
}

/**
 * @description 根据当前跳转的路由设置显示在浏览器标签的title
 * @param {Object} routeItem 路由对象
 * @param {Object} vm Vue实例
 */
export const setTitle = (routeItem, vm) => {
  const handledRoute = getRouteTitleHandled(routeItem)
  const pageTitle = showTitle(handledRoute, vm)
  const resTitle = pageTitle ? `${title} - ${pageTitle}` : title
  window.document.title = resTitle
}

export const moment = (date) => {
  // 超过7天，显示日期
  if (dayjs(date).isBefore(dayjs().subtract(7, 'days'))) {
    return dayjs(date).format('YYYY-MM-DD')
  } else {
    // 1小前，xx小时前，X天前
    return dayjs(date)
      .locale('zh-cn')
      .from(dayjs())
  }
}

export const sortObj = (arr, property) => {
  return arr.sort((m, n) => m[property] - n[property])
}

export const updateNode = (tree, node) => {
  for (let i = 0; i < tree.length; i++) {
    const currentNode = tree[i]
    if (currentNode.nodeKey === node.nodeKey) {
      tree.splice(i, 1, node)
      return tree
    } else {
      if (currentNode.children && currentNode.children.length > 0) {
        updateNode(currentNode.children, node)
      }
    }
  }
  return tree
}

// this.menuData = this.menuData -> children -> ... -> selectNode
// 1. parent 2. selectNdoe -> new menuData
export const insertNode = (parent, select, data) => {
  // 1. 遍历parent -> select push
  // 2. children -> push child
  // 3. return parent
  for (let i = 0; i < parent.length; i++) {
    const item = parent[i]
    // 去重
    if (item.nodeKey === select.nodeKey) {
      // 排序
      parent.push(data)
      parent = sortObj(parent, 'sort')
      return parent
    } else {
      if (item.children && item.children.length > 0) {
        insertNode(item.children, select, data)
      }
    }
  }
  return parent
}

export const deleteNode = (tree, node) => {
  for (let i = 0; i < tree.length; i++) {
    const currentNode = tree[i]
    if (currentNode.nodeKey === node.nodeKey) {
      tree.splice(i, 1)
      return tree
    } else {
      if (currentNode.children && currentNode.children.length > 0) {
        deleteNode(currentNode.children, node)
      }
    }
  }
  return tree
}

/**
 *
 * @param {*} node 节点
 * @param {*} property 要删除的属性
 */
export const deleteKey = (node, property) => {
  if (node.children && node.children.length > 0) {
    node.children.forEach((item) => {
      delete item[property]
      if (item.children && item.children.length > 0) {
        deleteKey(item.children, property)
      }
    })
  }
  return node
}

// 获取节点的父级节点（一级节点）
export const getNode = (arr, node) => {
  for (let i = 0; i < arr.length; i++) {
    const currentNode = arr[i]
    // 当前的循环中是否有该节点
    if (currentNode.nodeKey === node.nodeKey) {
      if (!currentNode.parent) {
        // 删除子节点上的parent属性
        deleteKey(currentNode, 'parent')
        return currentNode
      } else {
        return true
      }
    } else {
      // 判断子节点中是否有该节点？
      if (currentNode.children && currentNode.children.length > 0) {
        currentNode.children.map((o) => {
          o.parent = currentNode
        })
        // 当前循环中是否有该节点
        if (getNode(currentNode.children, node)) {
          // 删除子节点上的parent属性
          deleteKey(currentNode, 'parent')
          return currentNode
        }
      }
    }
  }
}

export const modifyNode = (tree, nodes, property, flag) => {
  for (let i = 0; i < tree.length; i++) {
    // 遍历整个树
    const currentNode = tree[i]
    if (nodes && nodes.length > 0) {
      // 传递了需要设置的节点（权限 ）
      if (nodes.includes(currentNode._id)) {
        const tmp = { ...currentNode }
        tmp[property] = flag
        tree.splice(i, 1, tmp)
      }
    } else {
      // 无节点，无需要特别设置的节点权限，统一去设置整个树形菜单
      const tmp = { ...currentNode }
      tmp[property] = flag
      tree.splice(i, 1, tmp)
    }
    if (currentNode.children && currentNode.children.length > 0) {
      modifyNode(currentNode.children, nodes, property, flag)
    }
    // _checked 或者 _selected 参考：https://www.iviewui.com/components/table 说明
    if (currentNode.operations && currentNode.operations.length > 0) {
      modifyNode(currentNode.operations, nodes, '_' + property, flag)
    }
  }
  return tree
}

export const flatten = (arr) => {
  while (arr.some((item) => Array.isArray(item))) {
    arr = [].concat(...arr)
  }
  return arr
}

export const getPropertyIds = (menu, properties) => {
  const arr = []
  // 遍历整个树形菜单数据
  menu.forEach((item) => {
    if (item.checked || item._checked) {
      arr.push(item._id)
    }
    // 查询两个属性下面的节点信息，children -> children -> operations
    properties.forEach((property) => {
      if (item[property] && item[property].length > 0) {
        arr.push(getPropertyIds(item[property], properties))
      }
    })
  })
  // [1,2,3 [2,3,4,[44,4,4]]]
  return flatten(arr)
}

export const sortMenus = (tree) => {
  tree = sortObj(tree, 'sort')
  if (tree.children && tree.children.length > 0) {
    tree.children = sortMenus(tree.children, 'sort')
  }
  if (tree.operations && tree.operations.length > 0) {
    tree.operations = sortMenus(tree.operations, 'sort')
  }
  return tree
}
