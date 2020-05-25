import log4js from 'koa-log4'

log4js.configure({
  appenders: {
    access: {
      type: 'dateFile',
      filename: 'logs/access.log',
      pattern: '-yyyy-MM-dd.log'
    },
    application: {
      type: 'dateFile',
      filename: 'logs/app.log',
      pattern: '-yyyy-MM-dd.log'
    },
    error: {
      type: 'dateFile',
      filename: 'logs/error.log',
      pattern: '-yyyy-MM-dd.log'
    },
    out: {type: 'console'}
  },
  categories: {
    default: {appenders: ['out'], level: 'info'},
    access: {appenders: ['access'], level: 'info'},
    application: {appenders: ['application'], level: 'WARN'},
    error: {appenders: ['error'], level: 'WARN'},
  }
})

export default log4js