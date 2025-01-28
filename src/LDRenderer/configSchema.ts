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
    baseColor: {
      type: 'color',
      description: 'base color to be used in the ld alignment',
      defaultValue: '#f00',
    },
    /**
     * #slot
     */
    color: {
      type: 'color',
      description: 'the color of each feature in a ld alignment',
      defaultValue: 'jexl:interpolate(count,scale)',
      contextVariable: ['count', 'maxScore', 'baseColor', 'scale'],
    },

    /**
     * #slot
     */
    maxHeight: {
      type: 'integer',
      description: 'the maximum height to be used in a ld rendering',
      defaultValue: 600,
    },
  },
  { explicitlyTyped: true },
)

export default LDRenderer
