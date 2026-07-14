import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import Knob from '@/components/Knob/Knob.vue'
import type { KnobProps } from '@/components/Knob/Knob.types'

const showError = vi.hoisted(() => vi.fn())

vi.mock('@/composables/useNotify.ts', () => ({
  useNotify: () => ({
    showError,
    showInfo: vi.fn(),
    showSuccess: vi.fn()
  })
}))

const mountKnob = (props: Partial<KnobProps> = {}) => mount(Knob, { props })

const slider = (wrapper: VueWrapper) => wrapper.get('[data-testid="knob-slider"]')
const nativeInput = (wrapper: VueWrapper) => wrapper.get('[data-testid="knob-input"]')
const valueLabel = (wrapper: VueWrapper) => wrapper.get('[data-testid="knob-value"]')

describe('Knob.vue', () => {
  beforeEach(() => {
    showError.mockClear()
  })

  describe('initialization and accessibility contract', () => {
    it('exposes the configured value range through stable slider attributes', () => {
      const wrapper = mountKnob({
        interactive: true,
        min: 10,
        max: 50,
        targetValue: 25,
        label: 'Temp Control',
        unit: '°F'
      })

      expect(slider(wrapper).attributes()).toMatchObject({
        role: 'slider',
        'aria-valuenow': '25',
        'aria-valuemin': '10',
        'aria-valuemax': '50',
        'aria-valuetext': 'Temp Control: 25 °F',
        'aria-disabled': 'false',
        tabindex: '0'
      })
      expect(nativeInput(wrapper).attributes()).toMatchObject({
        min: '10',
        max: '50',
        tabindex: '-1'
      })
      expect(valueLabel(wrapper).text()).toBe('25 °F')
      expect(showError).not.toHaveBeenCalled()
    })

    it('renders read-only by default and does not expose a native input', () => {
      const wrapper = mountKnob({ targetValue: 20 })

      expect(slider(wrapper).attributes('aria-disabled')).toBe('true')
      expect(wrapper.find('[data-testid="knob-input"]').exists()).toBe(false)
      expect(slider(wrapper).attributes('aria-valuenow')).toBe('20')
      expect(wrapper.emitted('change')).toBeUndefined()
    })
  })

  describe('validation and safe values', () => {
    it.each([
      { props: { min: 30, max: 10, targetValue: 20 }, expectedValue: '20' },
      { props: { min: 10, max: 10, targetValue: 10 }, expectedValue: '10' },
      { props: { min: Number.NaN, max: Number.POSITIVE_INFINITY, targetValue: 20 }, expectedValue: '20' }
    ])('falls back to default bounds when configured bounds are invalid', ({ props, expectedValue }) => {
      const wrapper = mountKnob(props)

      expect(slider(wrapper).attributes('aria-valuemin')).toBe('0')
      expect(slider(wrapper).attributes('aria-valuemax')).toBe('100')
      expect(slider(wrapper).attributes('aria-valuenow')).toBe(expectedValue)
      expect(showError).toHaveBeenCalledTimes(1)
    })

    it.each([
      { targetValue: 5, expectedValue: '10' },
      { targetValue: 75, expectedValue: '50' },
      { targetValue: Number.NaN, expectedValue: '10' }
    ])('clamps invalid target values to the configured range', ({ targetValue, expectedValue }) => {
      const wrapper = mountKnob({ min: 10, max: 50, targetValue })

      expect(slider(wrapper).attributes('aria-valuenow')).toBe(expectedValue)
      expect(showError).toHaveBeenCalledTimes(1)
    })

    it('keeps the current value inside the range when props change', async () => {
      const wrapper = mountKnob({ min: 0, max: 100, targetValue: 80 })

      await wrapper.setProps({ max: 60 })
      expect(slider(wrapper).attributes('aria-valuenow')).toBe('60')

      await wrapper.setProps({ min: 50, max: 55 })
      expect(slider(wrapper).attributes('aria-valuenow')).toBe('55')

      await wrapper.setProps({ targetValue: 52 })
      expect(slider(wrapper).attributes('aria-valuenow')).toBe('52')
    })
  })

  describe('interactions', () => {
    it('updates and emits the selected value on native slider change', async () => {
      const wrapper = mountKnob({ interactive: true })

      await nativeInput(wrapper).setValue(35)

      expect(slider(wrapper).attributes('aria-valuenow')).toBe('35')
      expect(wrapper.emitted('change')).toEqual([[35]])
    })

    it('clamps and emits the safe value on native slider change', async () => {
      const wrapper = mountKnob({ interactive: true, min: 10, max: 50, targetValue: 20 })

      await nativeInput(wrapper).setValue(75)

      expect(slider(wrapper).attributes('aria-valuenow')).toBe('50')
      expect(wrapper.emitted('change')).toEqual([[50]])
    })
  })
})
