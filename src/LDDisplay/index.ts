import DisplayType from '@jbrowse/core/pluggableElementTypes/DisplayType'

import configSchemaF from './configSchema'
import stateModelFactory from './stateModel'

import type PluginManager from '@jbrowse/core/PluginManager'
import type LinearGenomeViewPlugin from '@jbrowse/plugin-linear-genome-view'

export default function LDDisplayF(pluginManager: PluginManager) {
  pluginManager.addDisplayType(() => {
    const configSchema = configSchemaF(pluginManager)
    const LGVPlugin = pluginManager.getPlugin(
      'LinearGenomeViewPlugin',
    ) as LinearGenomeViewPlugin
    const { BaseLinearDisplayComponent } = LGVPlugin.exports
    return new DisplayType({
      name: 'LDDisplay',
      displayName: 'Linkage disequilibrium',
      configSchema,
      stateModel: stateModelFactory(pluginManager, configSchema),
      trackType: 'VariantTrack',
      viewType: 'LinearGenomeView',
      ReactComponent: BaseLinearDisplayComponent,
    })
  })
}
