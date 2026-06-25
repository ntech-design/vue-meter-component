import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Knob from '@/components/Knob.vue'

describe('Knob.vue', () => {
  describe('Accessibility (a11y) & Initialization', () => {
    it('sets the correct ARIA attributes and role based on inputs', () => {
      const wrapper = mount(Knob, {
        props: { min: 10, max: 50, targetValue: 25, label: 'Temp Control' }
      })

      const slider = wrapper.find('[role="slider"]')

      expect(slider.exists()).toBe(true)
      expect(slider.attributes('aria-valuenow')).toBe('25')
      expect(slider.attributes('aria-valuemin')).toBe('10')
      expect(slider.attributes('aria-valuemax')).toBe('50')
      expect(slider.attributes('aria-label')).toBe('Temp Control')
      expect(slider.attributes('tabindex')).toBe('0')
    })

    it('warns about invalid min and max bounds without swapping them', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
      const wrapper = mount(Knob, {
        props: { min: 30, max: 10, targetValue: 20 }
      })

      const slider = wrapper.find('[role="slider"]')
      const nativeInput = wrapper.find('input[type="range"]')

      expect(slider.attributes('aria-valuemin')).toBe('0')
      expect(slider.attributes('aria-valuemax')).toBe('100')
      expect(slider.attributes('aria-valuenow')).toBe('20')
      expect(nativeInput.attributes('min')).toBe('0')
      expect(nativeInput.attributes('max')).toBe('100')
      expect(warn).toHaveBeenCalledWith('Invalid Knob bounds: min (30) must be smaller than max (10).')
    })

    it('warns when min and max are equal', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
      const wrapper = mount(Knob, {
        props: { min: 10, max: 10, targetValue: 10 }
      })

      const slider = wrapper.find('[role="slider"]')

      expect(slider.attributes('aria-valuemin')).toBe('0')
      expect(slider.attributes('aria-valuemax')).toBe('100')
      expect(slider.attributes('aria-valuenow')).toBe('10')
      expect(warn).toHaveBeenCalledWith('Invalid Knob bounds: min (10) must be smaller than max (10).')
    })

    it('clamps targetValue below the minimum bound', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
      const wrapper = mount(Knob, {
        props: { min: 10, max: 50, targetValue: 5 }
      })

      expect(wrapper.find('[role="slider"]').attributes('aria-valuenow')).toBe('10')
      expect(warn).toHaveBeenCalledWith('Invalid Knob targetValue: 5 must be between 10 and 50.')
    })

    it('clamps targetValue above the maximum bound', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
      const wrapper = mount(Knob, {
        props: { min: 10, max: 50, targetValue: 75 }
      })

      expect(wrapper.find('[role="slider"]').attributes('aria-valuenow')).toBe('50')
      expect(warn).toHaveBeenCalledWith('Invalid Knob targetValue: 75 must be between 10 and 50.')
    })

    it('uses finite fallback bounds when min or max are not finite numbers', () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
      const wrapper = mount(Knob, {
        props: { min: Number.NaN, max: Number.POSITIVE_INFINITY, targetValue: 20 }
      })

      const slider = wrapper.find('[role="slider"]')

      expect(slider.attributes('aria-valuemin')).toBe('0')
      expect(slider.attributes('aria-valuemax')).toBe('100')
      expect(slider.attributes('aria-valuenow')).toBe('20')
      expect(warn).toHaveBeenCalledWith('Invalid Knob bounds: min (NaN) must be smaller than max (Infinity).')
    })
  })

  describe('Keyboard Navigation', () => {
    it('increments the value when pressing ArrowUp or ArrowRight', async () => {
      const wrapper = mount(Knob, {
        props: { targetValue: 20, max: 100 }
      })
      const slider = wrapper.find('[role="slider"]')

      await slider.trigger('keydown', { key: 'ArrowUp' })
      expect(slider.attributes('aria-valuenow')).toBe('21')

      await slider.trigger('keydown', { key: 'ArrowRight' })
      expect(slider.attributes('aria-valuenow')).toBe('22')
    })

    it('decrements the value when pressing ArrowDown or ArrowLeft', async () => {
      const wrapper = mount(Knob, {
        props: { targetValue: 20, min: 0 }
      })
      const slider = wrapper.find('[role="slider"]')

      await slider.trigger('keydown', { key: 'ArrowDown' })
      expect(slider.attributes('aria-valuenow')).toBe('19')

      await slider.trigger('keydown', { key: 'ArrowLeft' })
      expect(slider.attributes('aria-valuenow')).toBe('18')
    })

    it('clamping: does not exceed the maximum bound limit', async () => {
      const wrapper = mount(Knob, {
        props: { targetValue: 99, max: 100 }
      })
      const slider = wrapper.find('[role="slider"]')

      await slider.trigger('keydown', { key: 'ArrowUp' })
      await slider.trigger('keydown', { key: 'ArrowUp' })

      expect(slider.attributes('aria-valuenow')).toBe('100')
    })

    it('clamping: does not go below the minimum bound limit', async () => {
      const wrapper = mount(Knob, {
        props: { targetValue: 1, min: 0 }
      })
      const slider = wrapper.find('[role="slider"]')

      await slider.trigger('keydown', { key: 'ArrowDown' })
      await slider.trigger('keydown', { key: 'ArrowDown' })

      expect(slider.attributes('aria-valuenow')).toBe('0')
    })
  })

  describe('SVG Graphics & Coordinate Math', () => {
    it('aligns marker lines precisely to the center coordinates', () => {
      const size = 60
      const expectedCenter = (size / 2).toString()

      const wrapper = mount(Knob, { props: { size } })
      const svgLines = wrapper.findAll('svg line')

      svgLines.forEach((line) => {
        const parentTagName = line.element.parentElement?.tagName.toLowerCase()

        if (parentTagName !== 'g') {
          expect(line.attributes('x2')).toBe(expectedCenter)
          expect(line.attributes('y2')).toBe(expectedCenter)
        }
      })
    })
  })

  describe('Interaction & Side Effects', () => {
    it('emits a change event and persists value on native slider change', async () => {
      const wrapper = mount(Knob)

      const nativeInput = wrapper.find('input[type="range"]')
      expect(nativeInput.exists()).toBe(true)

      await nativeInput.setValue(35)
      await nativeInput.trigger('change')
      await wrapper.vm.$nextTick() // Ensure Vue synchronizes state properties down to the template

      expect(wrapper.emitted('change')).toBeTruthy()
      expect(wrapper.emitted('change')?.[0]).toEqual([35])
    })

    it('clamps and emits the safe value on native slider change', async () => {
      const wrapper = mount(Knob, {
        props: { min: 10, max: 50, targetValue: 20, storageKey: 'bounded_storage_key' }
      })

      const nativeInput = wrapper.find('input[type="range"]')

      await nativeInput.setValue(75)
      await nativeInput.trigger('change')

      expect(wrapper.emitted('change')?.[0]).toEqual([50])
    })
  })
})
