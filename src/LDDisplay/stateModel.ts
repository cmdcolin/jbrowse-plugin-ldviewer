import { getEnv, getSession, SimpleFeature } from '@jbrowse/core/util'
import { addDisposer, types } from 'mobx-state-tree'

import { ConfigurationReference, getConf } from '@jbrowse/core/configuration'
import PluginManager from '@jbrowse/core/PluginManager'
import LinearGenomeViewPlugin from '@jbrowse/plugin-linear-genome-view'

import type { Instance } from 'mobx-state-tree'
import type { AnyConfigurationSchemaType } from '@jbrowse/core/configuration'
import { autorun } from 'mobx'
/**
 * #stateModel LDDisplay
 * extends
 * - [BaseLinearDisplay](../baselineardisplay)
 */
export default function stateModelFactory(
  pluginManager: PluginManager,
  configSchema: AnyConfigurationSchemaType,
) {
  const LGVPlugin = pluginManager.getPlugin(
    'LinearGenomeViewPlugin',
  ) as LinearGenomeViewPlugin
  const { BaseLinearDisplay } = LGVPlugin.exports
  return types
    .compose(
      'LDDisplay',
      BaseLinearDisplay,
      types.model({
        /**
         * #property
         */
        type: types.literal('LDDisplay'),

        /**
         * #property
         */
        configuration: ConfigurationReference(configSchema),
      }),
    )
    .volatile(() => ({
      /**
       * #volatile
       */
      featuresVolatile: undefined as undefined | SimpleFeature[],
      /**
       * #volatile
       */
      lineZoneHeight: 50,
    }))
    .actions(self => ({
      /**
       * #action
       */
      setSimplifiedFeatures(arg: SimpleFeature[]) {
        self.featuresVolatile = arg
      },
    }))
    .views(self => {
      const { renderProps: superRenderProps } = self
      return {
        /**
         * #getter
         */
        get blockType() {
          return 'dynamicBlocks'
        },
        /**
         * #getter
         */
        get rendererTypeName() {
          return 'LDRenderer'
        },
        /**
         * #method
         */
        renderProps() {
          const config = self.rendererType.configSchema.create(
            {
              ...getConf(self, 'renderer'),
            },
            getEnv(self),
          )

          return {
            ...superRenderProps(),
            config,
            rpcDriverName: self.rpcDriverName,
            displayModel: self,
          }
        },
      }
    })
}

export type LDDisplayStateModel = ReturnType<typeof stateModelFactory>
export type LDDisplayModel = Instance<LDDisplayStateModel>
