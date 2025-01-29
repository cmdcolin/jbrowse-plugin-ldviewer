import DisplayType from '@jbrowse/core/pluggableElementTypes/DisplayType'

import LDDisplayComponent from './components/LDDisplay'
import configSchemaF from './configSchema'
import stateModelFactory from './stateModel'

import type PluginManager from '@jbrowse/core/PluginManager'

export default function LDDisplayF(pluginManager: PluginManager) {
  pluginManager.addDisplayType(() => {
    const configSchema = configSchemaF(pluginManager)
    return new DisplayType({
      name: 'LDDisplay',
      displayName: 'Linkage disequilibrium',
      configSchema,
      stateModel: stateModelFactory(pluginManager, configSchema),
      trackType: 'VariantTrack',
      viewType: 'LinearGenomeView',
      ReactComponent: LDDisplayComponent,
    })
  })
}
