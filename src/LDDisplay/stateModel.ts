import PluginManager from '@jbrowse/core/PluginManager'
import { ConfigurationReference, getConf } from '@jbrowse/core/configuration'
import { SimpleFeature, getEnv, getSession } from '@jbrowse/core/util'
import LinearGenomeViewPlugin from '@jbrowse/plugin-linear-genome-view'
import { types } from 'mobx-state-tree'


import type { AnyConfigurationSchemaType } from '@jbrowse/core/configuration'
import type { Instance } from 'mobx-state-tree'
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
          const session = getSession(self)
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
            ldserver: getConf(session, ['LDViewerPlugin', 'ldserver']),
          }
        },
      }
    })
}

export type LDDisplayStateModel = ReturnType<typeof stateModelFactory>
export type LDDisplayModel = Instance<LDDisplayStateModel>
