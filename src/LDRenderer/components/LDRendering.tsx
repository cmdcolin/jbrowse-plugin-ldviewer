import React, { useEffect } from 'react'
import { PrerenderedCanvas } from '@jbrowse/core/ui'
import { observer } from 'mobx-react'

import type { Region } from '@jbrowse/core/util/types'
import { SimpleFeature, type SimpleFeatureSerialized } from '@jbrowse/core/util'

const LDRendering = observer(function (props: {
  blockKey: string
  width: number
  height: number
  regions: Region[]
  bpPerPx: number
  displayModel: any
  simplifiedFeatures: SimpleFeatureSerialized[]
}) {
  const { simplifiedFeatures, displayModel } = props
  useEffect(() => {
    displayModel.setSimplifiedFeatures(
      simplifiedFeatures.map(f => new SimpleFeature(f)),
    )
  }, [displayModel, simplifiedFeatures])
  return <PrerenderedCanvas {...props} />
})

export default LDRendering
