import React, { useMemo } from 'react'

import { observer } from 'mobx-react'
import { getEnv } from '@jbrowse/core/util'
import LinesConnectingMatrixToGenomicPosition from './LinesConnectingMatrixToGenomicPosition'

import type { LDDisplayModel } from '../stateModel'
import type LinearGenomeViewPlugin from '@jbrowse/plugin-linear-genome-view'

const LDDisplayComponent = observer(function (props: {
  model: LDDisplayModel
}) {
  const { model } = props
  const { lineZoneHeight } = model
  const BaseComponent = useMemo(() => {
    const { pluginManager } = getEnv(model)
    const LGVPlugin = pluginManager.getPlugin(
      'LinearGenomeViewPlugin',
    ) as LinearGenomeViewPlugin
    const { BaseLinearDisplayComponent } = LGVPlugin.exports
    return BaseLinearDisplayComponent
  }, [])

  return (
    <div style={{ position: 'relative' }}>
      <LinesConnectingMatrixToGenomicPosition model={model} />
      <div id="wow" style={{ position: 'absolute', top: lineZoneHeight }}>
        <BaseComponent {...props} />
      </div>
    </div>
  )
})
export default LDDisplayComponent
