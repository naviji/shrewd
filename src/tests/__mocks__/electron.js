module.exports = {
  require: jest.fn(),
  match: jest.fn(),
  app: {
    isReady: jest.fn(x => true),
    requestSingleInstanceLock: jest.fn(x => true),
    on: jest.fn()
  },
  remote: {
    app: {
      getPath: jest.fn()
    }
  },
  dialog: jest.fn(),
  screen: {
    getPrimaryDisplay: {
      workAreaSize: jest.fn(x => { return { width: 1000, height: 1000 } })
    }
  }
}
