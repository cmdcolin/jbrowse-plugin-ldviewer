import LDRenderer from './LDRenderer'
import ReactComponent from './components/LDRendering'
import configSchema from './configSchema'

import type PluginManager from '@jbrowse/core/PluginManager'

export default function LDRendererF(pluginManager: PluginManager) {
  pluginManager.addRendererType(
    () =>
      new LDRenderer({
        name: 'LDRenderer',
        ReactComponent,
        configSchema,
        pluginManager,
      }),
  )
}
