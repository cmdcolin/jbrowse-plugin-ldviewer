import { ConfigurationSchema } from '@jbrowse/core/configuration'

/**
 * #config LDRenderer
 * #category renderer
 */
function x() {} // eslint-disable-line @typescript-eslint/no-unused-vars

const LDRenderer = ConfigurationSchema(
  'LDRenderer',
  {
    /**
     * #slot
     */
    renderPadding: 200,
  },
  { explicitlyTyped: true },
)

export default LDRenderer
