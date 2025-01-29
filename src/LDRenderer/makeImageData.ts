import { readConfObject } from '@jbrowse/core/configuration'
import { SimpleFeatureSerialized } from '@jbrowse/core/util'
import { checkStopToken } from '@jbrowse/core/util/stopToken'

import type { RenderArgsDeserialized } from './LDRenderer'
import type PluginManager from '@jbrowse/core/PluginManager'
import type { RenderArgs as ServerSideRenderArgs } from '@jbrowse/core/pluggableElementTypes/renderers/ServerSideRendererType'
import type { Region } from '@jbrowse/core/util/types'

export interface RenderArgs extends ServerSideRenderArgs {
  regions: Region[]
}

export async function makeImageData(
  ctx: CanvasRenderingContext2D,
  props: RenderArgsDeserialized & { pluginManager: PluginManager },
) {
  const { config, regions, ldserver, bpPerPx, stopToken, adapterConfig } = props
  const region = regions[0]!
  const w = (region.end - region.start) / bpPerPx
  const url = `${ldserver}/?ref=${region.refName}&start=${region.start}&end=${region.end}&url=${readConfObject(adapterConfig, 'vcfGzLocation').uri}`

  const ret = await fetch(url)
  if (!ret.ok) {
    throw new Error(`Failed to fetch ${url}`)
  }

  const { snps, ld } = (await ret.json()) as {
    snps: SimpleFeatureSerialized[]
    ld: string
  }
  checkStopToken(stopToken)

  const padding = readConfObject(config, 'renderPadding')
  const lines = ld.split('\n').filter(f => !!f)
  const boxw = Math.min((w - padding) / lines.length, 18)
  const bw = boxw / Math.sqrt(2)
  const trans = w / 2 - (lines.length * boxw) / 2

  ctx.save()
  ctx.translate(trans, 0)
  ctx.rotate(-Math.PI / 4)
  for (const [j, line_] of lines.entries()) {
    const line = line_
    const scoreline = line.split('\t')
    for (const [i, element] of scoreline.entries()) {
      const score = +element
      ctx.fillStyle = `hsl(0,80%,${90 - score * 50}%)`
      ctx.fillRect(i * bw, j * bw, bw, bw)
    }
  }
  ctx.restore()
  return {
    simplifiedFeatures: snps,
  }
}
