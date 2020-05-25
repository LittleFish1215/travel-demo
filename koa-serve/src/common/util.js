import { getValue } from '../config/RedisConfig'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import config from '../config/index'

/**
 * 获取jwt的载荷
 * @param {*} token 用户携带的token 
 */
const getJWTPayload = (token) => {
  return jwt.verify(token.split(' ')[1], config.JWT_SECRET)
}

const checkCode = async (key, value) => {
  // 从redis中获取图形验证码的数据
  const redisData = await getValue(key)
  // 都转成小写进行比较
  if (redisData != null) {
    if (redisData.toLowerCase() === value.toLowerCase()) {
      return true
    } else {
      return false
    }
  } else {
    return false
  }

}

const getStats = (path) => {
  return new Promise((resolve) => {
    // fs.stats(path, (err, stats) => {
    //   if (err) {
    //     resolve(false)
    //   } else {
    //     resolve(stats)
    //   }
    // })
    fs.stat(path, (err, stats) => err ? resolve(false) : resolve(stats))
  })
}

const mkdir = (dir) => {
  return new Promise((resolve) => {
    fs.mkdir(dir, err => err ? resolve(false) : resolve(true))
  })
}

const dirExists = async (dir) => {
  const isExists = await getStats(dir)
  // 如果该路径存在且不是文件，返回 true
  if (isExists && isExists.isDirectory()) {
    return true
  } else if (isExists) {
    // 路径存在，但是是文件，返回 false
    return false
  }
  // 如果该路径不存在
  const tempDir = path.parse(dir).dir
  // 循环遍历，递归判断如果上级目录不存在，则产生上级目录
  const status = await dirExists(tempDir)
  if (status) {
    const result = await mkdir(dir)
    return result
  } else {
    return false
  }
}

const rename = (obj, key, newKey) => {
  if (Object.keys(obj).indexOf(key) !== -1) {
    obj[newKey] = obj[key]
    delete obj[key]
  }
  return obj
}

const sortObj = (arr, property) => {
  return arr.sort((m, n) => m[property] - n[property])
}

const sortMenus = (tree) => {
  tree = sortObj(tree, 'sort')
  if (tree.children && tree.children.length > 0) {
    tree.children = sortMenus(tree.children, 'sort')
  }
  if (tree.operations && tree.operations.length > 0) {
    tree.operations = sortMenus(tree.operations, 'sort')
  }
  return tree
}

const getMenuData = (tree, rights, flag) => {
  const arr = []
  for (let i = 0; i < tree.length; i++) {
    const item = tree[i]
    // _id 包含在menus中
    // 结构进行改造，删除opertaions
    if (rights.includes(item._id + '') || flag) {
      if (item.type === 'menu') {
        arr.push({
          _id: item._id,
          path: item.path,
          meta: {
            title: item.title,
            hideInBread: item.hideInBread,
            hideInMenu: item.hideInMenu,
            notCache: item.notCache,
            icon: item.icon
          },
          component: item.component,
          children: getMenuData(item.children, rights)
        })
      } else if (item.type === 'link') {
        arr.push({
          _id: item._id,
          path: item.path,
          meta: {
            title: item.title,
            icon: item.icon,
            href: item.link
          }
        })
      }
    }
  }

  return sortObj(arr, 'sort')
}

const flatten = (arr) => {
  while (arr.some((item) => Array.isArray(item))) {
    arr = [].concat(...arr)
  }
  return arr
}

const getRights = (tree, menus) => {
  let arr = []
  for (let item of tree) {
    if (item.operations && item.operations.length > 0) {
      for (let op of item.operations) {
        if (menus.includes(op._id + '')) {
          arr.push(op.path)
        }
      }
    } else if (item.children && item.children.length > 0) {
      arr.push(getRights(item.children, menus))
    }
  }
  return flatten(arr)
}

export {
  checkCode,
  getJWTPayload,
  dirExists,
  rename,
  getMenuData,
  getRights,
  sortMenus,
}