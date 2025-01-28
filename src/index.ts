import Plugin from '@jbrowse/core/Plugin'
import PluginManager from '@jbrowse/core/PluginManager'

import { version } from '../package.json'
import LDDisplayF from './LDDisplay'
import LDRendererF from './LDRenderer'

export default class LDViewer extends Plugin {
  name = 'LDViewer'
  version = version

  install(pluginManager: PluginManager) {
    LDDisplayF(pluginManager)
    LDRendererF(pluginManager)
  }

  configure(pluginManager: PluginManager) {}
}
