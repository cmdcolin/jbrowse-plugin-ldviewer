import Plugin from '@jbrowse/core/Plugin'
import PluginManager from '@jbrowse/core/PluginManager'

import { version } from '../package.json'

export default class LDViewer extends Plugin {
  name = 'LDViewer'
  version = version

  install(pluginManager: PluginManager) {}

  configure(pluginManager: PluginManager) {}
}
