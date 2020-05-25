import Main from '@/components/main'

export default [
  // 菜单分三种情况
  // 链接式的跳转 -> doc
  // 内嵌的子页面 -> Main Layout -> children
  // 一级菜单上添加的路由 （hideInMenu hideInBread）

  // 内容管理
  // 1. 文章管理 -> 文章内容管理, 文章标签管理（热门、精华 etc）
  {
    path: '/spot',
    name: 'attractions_management',
    meta: {
      icon: 'md-albums',
      title: '景点管理',
      notCache: true
    },
    component: Main,
    children: [
      {
        path: 'index',
        name: 'spot_management',
        meta: {
          icon: 'ios-paper',
          title: '景点信息管理',
          notCache: true
        },
        component: () => import('@/view/spot/index.vue')
      },
      {
        path: 'comments',
        name: 'spot_comments',
        meta: {
          icon: 'ios-paper',
          title: '景点评论管理',
          notCache: true
        },
        component: () => import('@/view/spot-comments/index.vue')
      }
    ]
  },
  {
    path: '/hotel',
    name: 'hotel_management',
    meta: {
      icon: 'ios-restaurant',
      title: '酒店管理',
      notCache: true
    },
    component: Main,
    children: [
      {
        path: 'index',
        name: 'hotel_info',
        meta: {
          icon: 'md-restaurant',
          title: '酒店信息管理',
          notCache: true
        },
        component: () => import('@/view/hotel/index.vue')
      },
      {
        path: 'comments',
        name: 'hotel_comments',
        meta: {
          icon: 'ios-text',
          title: '酒店评论管理',
          notCache: true
        },
        component: () => import('@/view/hotel-comments/index.vue')
      }
    ]
  },
  {
    path: '/strategy',
    name: 'strategy_management',
    meta: {
      icon: 'md-albums',
      title: '攻略管理',
      notCache: true
    },
    component: Main,
    children: [
      {
        path: 'index',
        name: 'strate_management',
        meta: {
          icon: 'ios-paper',
          title: '攻略管理',
          notCache: true
        },
        component: () => import('@/view/strategy/index.vue')
      }
    ]
  },
  {
    path: '/note',
    name: 'notes_management',
    meta: {
      icon: 'md-albums',
      title: '游记管理',
      notCache: true
    },
    component: Main,
    children: [
      {
        path: 'index',
        name: 'note_management',
        meta: {
          icon: 'ios-paper',
          title: '游记信息管理',
          notCache: true
        },
        component: () => import('@/view/note/index.vue')
      }
    ]
  },
  {
    path: '/user',
    name: 'user',
    meta: {
      icon: 'md-albums',
      title: '用户管理',
      notCache: true,
      access: ['super_admin', 'admin']
    },
    component: Main,
    children: [
      {
        path: 'index',
        name: 'user_management',
        meta: {
          icon: 'ios-people',
          title: '用户管理',
          notCache: true,
          access: ['super_admin', 'admin']
        },
        component: () => import('@/view/user/index.vue')
      }
    ]
  },
  {
    path: '/menu',
    name: 'menu',
    meta: {
      icon: 'md-settings',
      title: '菜单管理',
      notCache: true
    },
    component: Main,
    children: [
      {
        path: 'index',
        name: 'menu_management',
        meta: {
          icon: 'ios-menu',
          title: '菜单管理',
          notCache: true
        },
        component: () => import('@/view/menu/index.vue')
      }
    ]
  },
  {
    path: '/roles',
    name: 'roles',
    meta: {
      icon: 'md-checkbox',
      title: '权限管理',
      notCache: true,
      access: ['super_admin', 'admin']
    },
    component: Main,
    children: [
      {
        path: 'index',
        name: 'roles_management',
        meta: {
          icon: 'md-key',
          title: '角色权限',
          notCache: true,
          access: ['super_admin', 'admin']
        },
        component: () => import('@/view/roles/index.vue')
      }
    ]
  }
]
