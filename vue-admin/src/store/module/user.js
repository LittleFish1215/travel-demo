import {
  getUserInfo
  // logout,
  // getMessage,
  // getContentByMsgId,
  // hasRead,
  // removeReaded,
  // restoreTrash,
  // getUnreadCount
} from '@/api/user'
import { login } from '@/api/login'
import { setToken, getToken } from '@/libs/util'

export default {
  state: {
    userName: '',
    userId: '',
    avatarImgPath: '',
    token: getToken(),
    access: '',
    hasGetInfo: false,
    unreadCount: 0,
    messageUnreadList: [],
    messageReadedList: [],
    messageTrashList: [],
    messageContentStore: {}
  },
  mutations: {
    setAvatar (state, avatarPath) {
      state.avatarImgPath = avatarPath
    },
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, name) {
      state.userName = name
    },
    setAccess (state, access) {
      state.access = access
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    },
    setHasGetInfo (state, status) {
      state.hasGetInfo = status
    },
    setMessageCount (state, count) {
      state.unreadCount = count
    },
    setMessageUnreadList (state, list) {
      state.messageUnreadList = list
    },
    setMessageReadedList (state, list) {
      state.messageReadedList = list
    },
    setMessageTrashList (state, list) {
      state.messageTrashList = list
    },
    updateMessageContentStore (state, { msg_id, content }) {
      state.messageContentStore[msg_id] = content
    },
    moveMsg (state, { from, to, msg_id }) {
      const index = state[from].findIndex((_) => _.msg_id === msg_id)
      const msgItem = state[from].splice(index, 1)[0]
      msgItem.loading = false
      state[to].unshift(msgItem)
    }
  },
  getters: {
    messageUnreadCount: (state) => state.messageUnreadList.length,
    messageReadedCount: (state) => state.messageReadedList.length,
    messageTrashCount: (state) => state.messageTrashList.length
  },
  actions: {
    // 登录
    handleLogin ({ commit }, loginInfo) {
      // userName = userName.trim()
      return new Promise((resolve, reject) => {
        login({
          ...loginInfo
        })
          .then((res) => {
            if (res.code === 200) {
              const data = res.data
              commit('setToken', res.token)
              commit('setAvatar', data.pic)
              commit('setUserName', data.name)
              commit('setUserId', data._id)
              commit('setAccess', data.roles)
              commit('setHasGetInfo', true)
            }
            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    // 退出登录
    handleLogOut ({ state, commit }) {
      return new Promise((resolve, reject) => {
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        commit('setToken', '')
        commit('setAccess', [])
        resolve()
      })
    },
    // 获取用户相关信息
    getUserInfo ({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          getUserInfo(state.token)
            .then((res) => {
              const data = res.data
              commit('setAvatar', data.pic)
              commit('setUserName', data.name)
              commit('setUserId', data._id)
              commit('setAccess', data.roles)
              commit('setHasGetInfo', true)
              resolve(data)
            })
            .catch((err) => {
              reject(err)
            })
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
