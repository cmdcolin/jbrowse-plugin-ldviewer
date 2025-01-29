import Plugin from '@jbrowse/core/Plugin'
import PluginManager from '@jbrowse/core/PluginManager'
import { ConfigurationSchema } from '@jbrowse/core/configuration'

import { version } from '../package.json'
import LDDisplayF from './LDDisplay'
import LDRendererF from './LDRenderer'

export default class LDViewer extends Plugin {
  name = 'LDViewerPlugin'
  version = version

  install(pluginManager: PluginManager) {
    LDDisplayF(pluginManager)
    LDRendererF(pluginManager)
  }

  /**
   * #config LinearGenomeViewConfigSchema
   */
  configurationSchema = ConfigurationSchema('LDPluginConfigSchema', {
    /**
     * #slot configuration.LinearGenomeViewPlugin.trackLabels
     */
    ldserver: {
      type: 'string',
      defaultValue: 'http://localhost:4730',
    },
  })

  configure(_pluginManager: PluginManager) {}
}
