
import BaseApplication from './classes/BaseApplication'
import { envFromArgs } from './lib/startupHelpers'
import Setting from './models/Setting'
import CommandService from './services/CommandService'

import Category from './models/Category'
import bridge from './bridge'

class Application extends BaseApplication {
  public async start (argv: string[]): Promise<any> {
    // shimInit(bridge())

    argv = await super.start(argv)
    const env = envFromArgs(argv)

    Setting.setConstant('appId', `net.naviji.stoic-${env}-desktop`)
    Setting.setConstant('appType', 'desktop')
    Setting.setConstant('appName', `stoic-${env}-desktop`)

    this.initRedux()

    CommandService.instance().registerAll()

    // Since the settings need to be loaded before the store is
    // created, it will never receive the SETTING_UPDATE_ALL even,
    // which mean state.settings will not be initialised. So we
    // manually call dispatchUpdateAll() to force an update.
    this.dispatch({
      type: 'settings/updateAll',
      payload: Setting.toPlainObject()
    })

    this.dispatch({ // What's the differnece between a store dispatch and a normal dispatch??
      type: 'categories/updateAll',
      items: Category.getAll()
    })

    this.store().dispatch({
      type: 'categoryGroups/setCollapsed',
      ids: Setting.get('collapsedCategoryGroupIds')
    })

    bridge().showMainWindow()

    return null
  }
}

let application_: Application = null

function app () {
  if (!application_) application_ = new Application()
  return application_
}

export default app
