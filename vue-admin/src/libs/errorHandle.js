import store from '@/store'
const addErrorLog = (errorInfo) => {
  const {
    statusText,
    status,
    request: { responseURL }
  } = errorInfo
  const info = {
    type: 'ajax',
    code: status,
    mes: statusText,
    url: responseURL
  }
  if (!responseURL.includes('save_error_logger')) {
    store.dispatch('addErrorLog', info)
  }
}
const errorHandle = (err) => {
  // console.log('TCL: errorHandle -> err', err)
  addErrorLog(err)
}

export default errorHandle
