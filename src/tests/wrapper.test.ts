import ElectronWrapper from '../classes/ElectronWrapper'

describe('Wrapper should', function () {
  it('parse arguments', async () => {
    let app = new ElectronWrapper(['node', 'electron', '.', '--env', 'dev'])
    expect(app.isDebugMode).toBe(false)
    expect(app.env).toBe('dev')

    app = new ElectronWrapper(['node', 'electron', '.', '--debug'])
    expect(app.isDebugMode).toBe(true)
    expect(app.env).toBe('prod')

    /// TODO : Add hot reload flag
  })
})
