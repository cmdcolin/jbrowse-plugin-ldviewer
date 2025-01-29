import { readConfObject } from '@jbrowse/core/configuration'
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
  const { regions, bpPerPx, stopToken, adapterConfig } = props
  const region = regions[0]!
  const w = (region.end - region.start) / bpPerPx
  const url = `http://localhost:4730/?ref=${region.refName}&start=${region.start}&end=${region.end}&url=${readConfObject(adapterConfig, 'vcfGzLocation').uri}`

  const ret = await fetch(url)
  if (!ret.ok) {
    throw new Error(`Failed to fetch ${url}`)
  }

  const { snps, ld } = await ret.json()
  checkStopToken(stopToken)

  const lines = ld.split('\n')
  const boxw = Math.min((w - 200) / lines.length, 18)
  const bw = boxw / Math.sqrt(2)
  const trans = w / 2 - (lines.length * boxw) / 2

  ctx.save()
  //
  //if (region.reversed === true) {
  //  ctx.scale(-1, 1)
  //  ctx.translate(-width, 0)
  //}
  ctx.translate(trans, 0)
  ctx.rotate(-Math.PI / 4)
  let j = 0
  for (const line of lines) {
    const scoreline = line.split('\t')
    for (let i = 0; i < scoreline.length; i++) {
      const score = +scoreline[i]
      ctx.fillStyle = `hsl(0,80%,${90 - score * 50}%)`
      ctx.fillRect(i * bw, j * bw, bw, bw)
    }
    j++
  }
  ctx.restore()
  return {
    simplifiedFeatures: snps,
  }
}
