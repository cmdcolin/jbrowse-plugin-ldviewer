import { ConfigurationSchema } from '@jbrowse/core/configuration'

import configSchema from '../LDRenderer/configSchema'

import type PluginManager from '@jbrowse/core/PluginManager'
import LinearGenomeViewPlugin from '@jbrowse/plugin-linear-genome-view'

/**
 * #config LDDisplay
 */
function x() {} // eslint-disable-line @typescript-eslint/no-unused-vars

export default function configSchemaF(pluginManager: PluginManager) {
  const LGVPlugin = pluginManager.getPlugin(
    'LinearGenomeViewPlugin',
  ) as LinearGenomeViewPlugin
  const { baseLinearDisplayConfigSchema } = LGVPlugin.exports
  return ConfigurationSchema(
    'LDDisplay',
    {
      /**
       * #slot
       */
      renderer: configSchema,

      /**
       * #slot
       */
      height: {
        type: 'number',
        defaultValue: 250,
      },
    },
    {
      baseConfiguration: baseLinearDisplayConfigSchema,
      /**
       * #baseConfiguration
       */
      explicitlyTyped: true,
    },
  )
}
