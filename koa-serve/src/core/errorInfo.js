/**
 * @description 失败信息集合 包含code 和 message
 * @author 郭朝夕
 */

module.exports = {
  // 用户名已存在
  registerUserNameExistInfo: {
    code: 10001,
    message: '用户名已存在'
  },
  registerNameExistInfo: {
    code: 10016,
    message: '昵称已存在'
  },
  // 注册失败
  registerFailInfo: {
    code: 10002,
    message: '注册失败，请重试'
  },
  // 用户名不存在
  registerUserNameNotExistInfo: {
    code: 10003,
    message: '用户名未存在'
  },
  // 登录失败
  loginFailInfo: {
    code: 10004,
    message: '登录失败，用户名或密码错误'
  },
  //图片验证码错误
  codeVerifyFailInfo: {
    code: 10014,
    message: '操作失败，图形验证码错误'
  },
  //图片验证码错误
  codeTimeoutInfo: {
    code: 10015,
    message: '登录失败，图形验证码已经过期'
  },

  // 未登录
  loginCheckFailInfo: {
    code: 10005,
    message: '您尚未登录'
  },
  // 修改密码失败
  changePasswordFailInfo: {
    code: 10006,
    message: '修改密码失败，请重试'
  },
  // 上传文件过大
  uploadFileSizeFailInfo: {
    code: 10007,
    message: '上传文件尺寸过大'
  },
  // 修改基本信息失败
  changeInfoFailInfo: {
    code: 10008,
    message: '修改基本信息失败'
  },
  // json schema 校验失败
  jsonSchemaFileInfo: {
    code: 10009,
    message: '数据格式校验错误'
  },
  // 删除用户失败
  deleteUserFailInfo: {
    code: 10010,
    message: '删除用户失败'
  },
  // 添加关注失败
  addFollowerFailInfo: {
    code: 10011,
    message: '添加关注失败'
  },
  // 取消关注失败
  deleteFollowerFailInfo: {
    code: 10012,
    message: '取消关注失败'
  },
  // 创建微博失败
  createBlogFailInfo: {
    code: 11001,
    message: '创建微博失败，请重试'
  },
  // 删除微博失败
  deleteBlogFailInfo: {
    code: 11002,
    message: '删除微博失败，请重试'
  },
  getWeekCommentsFail: {
    code: 20001,
    message: '获取最近评论列表失败'
  },
  bannedToPostFail: {
    code: 20002,
    message: '当前用户已经被禁言'
  },
  addCommentsFail: {
    code: 20003,
    message: '添加评论失败'
  },
  setBestCommentsFail: {
    code: 20004,
    message: '采纳最佳答案失败'
  },
  blogIsEndFail: {
    code: 20005,
    message: '帖子已经结贴，无法采纳'
  },
  likeFail: {
    code: 20006,
    message: '您已经点赞，请勿重复点赞'
  },
  saveLikeFail: {
    code: 20007,
    message: '保存点赞记录失败'
  }
}
