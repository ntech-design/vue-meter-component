import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import Knob from './Knob.vue'
import { setupStorageMock } from '../test/utils/storageMock'

describe('Knob.vue', () => {
  setupStorageMock()

  describe('Accessibility (a11y) & Initialization', () => {
    it('sets the correct ARIA attributes and role based on inputs', () => {
      const wrapper = mount(Knob, {
        props: { min: 10, max: 50, initialValue: 25, label: 'Temp Control' }
      })

      const slider = wrapper.find('[role="slider"]')

      expect(slider.exists()).toBe(true)
      expect(slider.attributes('aria-valuenow')).toBe('25')
      expect(slider.attributes('aria-valuemin')).toBe('10')
      expect(slider.attributes('aria-valuemax')).toBe('50')
      expect(slider.attributes('aria-label')).toBe('Temp Control')
      expect(slider.attributes('tabindex')).toBe('0')
    })

    it('loads the initial value from localStorage if available', () => {
      window.localStorage.setItem('knob_temperature_value', '42')

      const wrapper = mount(Knob)
      const slider = wrapper.find('[role="slider"]')

      expect(slider.attributes('aria-valuenow')).toBe('42')
      expect(wrapper.text()).toContain('42 ')
    })
  })

  describe('Keyboard Navigation', () => {
    it('increments the value when pressing ArrowUp or ArrowRight', async () => {
      const wrapper = mount(Knob, {
        props: { initialValue: 20, max: 100 }
      })
      const slider = wrapper.find('[role="slider"]')

      await slider.trigger('keydown', { key: 'ArrowUp' })
      expect(slider.attributes('aria-valuenow')).toBe('21')

      await slider.trigger('keydown', { key: 'ArrowRight' })
      expect(slider.attributes('aria-valuenow')).toBe('22')
    })

    it('decrements the value when pressing ArrowDown or ArrowLeft', async () => {
      const wrapper = mount(Knob, {
        props: { initialValue: 20, min: 0 }
      })
      const slider = wrapper.find('[role="slider"]')

      await slider.trigger('keydown', { key: 'ArrowDown' })
      expect(slider.attributes('aria-valuenow')).toBe('19')

      await slider.trigger('keydown', { key: 'ArrowLeft' })
      expect(slider.attributes('aria-valuenow')).toBe('18')
    })

    it('clamping: does not exceed the maximum bound limit', async () => {
      const wrapper = mount(Knob, {
        props: { initialValue: 99, max: 100 }
      })
      const slider = wrapper.find('[role="slider"]')

      await slider.trigger('keydown', { key: 'ArrowUp' })
      await slider.trigger('keydown', { key: 'ArrowUp' })

      expect(slider.attributes('aria-valuenow')).toBe('100')
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
      const wrapper = mount(Knob, {
        props: { storageKey: 'custom_storage_key' }
      })

      const nativeInput = wrapper.find('input[type="range"]')
      expect(nativeInput.exists()).toBe(true)

      await nativeInput.setValue(35)
      await nativeInput.trigger('change')
      await wrapper.vm.$nextTick() // Ensure Vue synchronizes state properties down to the template

      expect(wrapper.emitted('change')).toBeTruthy()
      expect(wrapper.emitted('change')?.[0]).toEqual([35])
      expect(window.localStorage.getItem('custom_storage_key')).toBe('35')
    })
  })
})
