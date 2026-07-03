<script setup lang="ts">
  import { computed, ref, watch } from 'vue'

  // Default values
  const DEFAULT_MIN = 0
  const DEFAULT_MAX = 100
  const DEFAULT_VALUE = 20

  // Properties with default values
  interface KnobProps {
    min?: number
    max?: number
    size?: number
    label?: string
    unit?: '°C' | '°F'
    targetValue?: number
  }

  const props = withDefaults(defineProps<KnobProps>(), {
    min: DEFAULT_MIN,
    max: DEFAULT_MAX,
    size: 50,
    label: 'Temperature Controller',
    unit: '°C',
    targetValue: DEFAULT_VALUE,
  })

  const isValidValue = (value: number, fallback: number) => Number.isFinite(value) ? value : fallback
  const hasValidBounds = computed(() => Number.isFinite(props.min) && Number.isFinite(props.max) && props.min < props.max)
  const safeBounds = computed(() => {
    if (hasValidBounds.value) {
      return { min: props.min, max: props.max }
    }

    return { min: DEFAULT_MIN, max: DEFAULT_MAX }
  })

  const clampValue = (value: number) => {
    const safeValue = isValidValue(value, safeBounds.value.min)
    return Math.min(safeBounds.value.max, Math.max(safeBounds.value.min, safeValue))
  }

  // Event Handling
  const emit = defineEmits<{
    change: [value: number]
  }>()

  const handleRelease = (): void => {
    currentValue.value = clampValue(currentValue.value)
    emit('change', currentValue.value)
  }

  // Validation
  const validationMessages = computed(() => {
    const messages: string[] = []

    if (!hasValidBounds.value) {
      messages.push(`Invalid Knob bounds: min (${props.min}) must be smaller than max (${props.max}).`)
    }

    if (
      hasValidBounds.value
      && Number.isFinite(props.targetValue)
      && (props.targetValue < props.min || props.targetValue > props.max)
    ) {
      messages.push(`Invalid Knob targetValue: ${props.targetValue} must be between ${props.min} and ${props.max}.`)
    }

    return messages
  })

  // State Management
  const currentValue = ref<number>(clampValue(props.targetValue))
  watch(() => props.targetValue, (newTarget) => { currentValue.value = clampValue(newTarget) })
  watch(safeBounds, () => { currentValue.value = clampValue(currentValue.value) })
  watch(validationMessages, (messages) => { messages.forEach((message) => console.warn(message)) }, { immediate: true })

  // Relative attributes
  const knobStroke = props.size / 15
  const knobPosition = computed<number>(() => props.size / 2)
  const knobRadius = computed<number>(() => (props.size - knobStroke) / 2)

  const getCurrentValue = computed<string>(() => `${currentValue.value} ${props.unit}`)
  const getRotationAngle = computed<number>(() => {
    const startAngle = 45      // Start Position: bottom left
    const totalRotation = 270  // Rotation Range: 360° - 90°
    const percentage = (currentValue.value - safeBounds.value.min) / (safeBounds.value.max - safeBounds.value.min)

    return startAngle + (percentage * totalRotation)
  })
</script>


<template>
  <section
    class="knob"
    role="slider"
    :aria-valuenow="currentValue"
    :aria-valuemin="safeBounds.min"
    :aria-valuemax="safeBounds.max"
    :aria-valuetext="`${label}: ${currentValue} ${props.unit}`"
    tabindex="0"
  >
    <input
      type="range"
      v-model.number="currentValue"
      :min="safeBounds.min"
      :max="safeBounds.max"
      aria-hidden="true"
      tabindex="-1"
      class="knob__input"
      @change="handleRelease"
    />

    <svg :width="size" :height="size" class="knob__ui" aria-hidden="true">
      <line
        :x1="0"
        :y1="size"
        :x2="knobPosition"
        :y2="knobPosition"
        :stroke-width="knobStroke"
        class="knob__ui__marker"
      />
      <line
        :x1="size"
        :y1="size"
        :x2="knobPosition"
        :y2="knobPosition"
        :stroke-width="knobStroke"
        class="knob__ui__marker"
      />

      <g id="knobMeter"
        :style="{
          transformOrigin: 'center',
          transform: `rotateZ(${getRotationAngle}deg)`
        }"
      >
        <circle
          :cx="knobPosition"
          :cy="knobPosition"
          :r="knobRadius"
          :stroke-width="knobStroke"
          class="knob__ui__circle"
        />

        <line
          :x1="knobPosition"
          :y1="knobPosition + knobRadius / 3"
          :x2="knobPosition"
          :y2="props.size - knobStroke"
          :stroke-width="knobStroke"
          class="knob__ui__marker"
        />
      </g>
    </svg>

    <span class="knob__value" aria-hidden="true">{{ getCurrentValue }}</span>
  </section>
</template>

<style lang="scss" scoped>
.knob {
  $_self: &;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  &:hover &__value { border-color: var(--accent-border); }
  &:hover &__ui__circle { fill: var(--ui-bg-hover); }
  &:focus-visible &__value {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  &__input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }

  &__value {
    font-family: var(--mono);
    display: inline-flex;
    font-size: 1rem;
    padding: 5px 10px;
    border-radius: var(--border-radius);
    color: var(--accent);
    background: var(--accent-bg);
    border: 2px solid transparent;
    transition: border-color 0.3s;
  }

  &__ui {
    &__circle {
      fill: var(--ui-bg);
      stroke: var(--ui-border);
      transition: fill 0.3s;
    }
    &__marker { stroke: var(--accent); }
  }
}
</style>
