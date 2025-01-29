import React from 'react'

import { getConf } from '@jbrowse/core/configuration'
import { getContainingView, getSession } from '@jbrowse/core/util'
import { observer } from 'mobx-react'

import type { LDDisplayModel } from '../stateModel'
import type { LinearGenomeViewModel } from '@jbrowse/plugin-linear-genome-view'

const Wrapper = observer(function ({
  children,
  model,
  exportSVG,
}: {
  model: LDDisplayModel
  children: React.ReactNode
  exportSVG?: boolean
}) {
  const { height } = model
  const { width, offsetPx } = getContainingView(model) as LinearGenomeViewModel
  const left = Math.max(0, -offsetPx)
  return exportSVG ? (
    <g transform={`translate(${left})`}>{children}</g>
  ) : (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left,
        pointerEvents: 'none',
        height,
        width,
      }}
    >
      {children}
    </svg>
  )
})

const LinesConnectingMatrixToGenomicPosition = observer(function ({
  model,
  exportSVG,
}: {
  model: LDDisplayModel
  exportSVG?: boolean
}) {
  const { assemblyManager } = getSession(model)
  const view = getContainingView(model) as LinearGenomeViewModel
  const { lineZoneHeight, featuresVolatile } = model
  const { offsetPx, assemblyNames, dynamicBlocks } = view
  const assembly = assemblyManager.get(assemblyNames[0]!)

  const padding = getConf(model, ['renderer', 'renderPadding'])
  const nfeat = featuresVolatile?.length ?? 0
  const w = dynamicBlocks.contentBlocks[0]?.widthPx ?? padding
  const boxw = Math.min((w - padding) / nfeat, 18)
  const trans = w / 2 - (nfeat * boxw) / 2
  const l = Math.max(offsetPx, 0)
  return assembly && featuresVolatile ? (
    <Wrapper exportSVG={exportSVG} model={model}>
      {featuresVolatile.map((f, i) => {
        const ref = f.get('refName')
        const c = view.bpToPx({
          refName: assembly.getCanonicalRefName(ref) ?? ref,
          coord: f.get('start'),
        })?.offsetPx
        return c === undefined ? null : (
          <line
            stroke="#0006"
            key={f.id()}
            x1={trans + i * boxw + boxw / 2}
            x2={c - l}
            y1={lineZoneHeight}
            y2={0}
          />
        )
      })}
    </Wrapper>
  ) : null
})

export default LinesConnectingMatrixToGenomicPosition
