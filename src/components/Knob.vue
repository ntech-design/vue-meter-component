<script setup lang="ts">
  import { computed, ref } from 'vue'

  // Properties with default values
  interface KnobProps {
    min?: number
    max?: number
    size?: number
    label?: string
    unit?: '°C' | 'F'
    initialValue?: number
    storageKey?: string
  }

  const props = withDefaults(defineProps<KnobProps>(), {
    min: 0,
    max: 100,
    size: 50,
    label: 'Temperature Controller',
    unit: '°C',
    initialValue: 20,
    storageKey: 'knob_temperature_value',
  })

  // Event Handling
  const emit = defineEmits<{ 'change': [value: number] }>()

  const handleRelease = () => {
    localStorage.setItem(props.storageKey, currentValue.value.toString())
    emit('change', currentValue.value)
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowRight') {
      currentValue.value = Math.min(props.max, currentValue.value + 1)
      localStorage.setItem(props.storageKey, currentValue.value.toString())
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') {
      currentValue.value = Math.max(props.min, currentValue.value - 1)
      localStorage.setItem(props.storageKey, currentValue.value.toString())
    }
  }

  // Storage / Persist
  const getStoredValue = (): number => {
    const stored = localStorage.getItem(props.storageKey)
    if (stored !== null) {
      const parsed = parseInt(stored, 10)
      if (!isNaN(parsed)) return parsed
    }
    return props.initialValue
  }

  // State Management
  const currentValue = ref<number>(getStoredValue())

  // Relative attributes
  const knobStroke = props.size / 15;
  const knobPosition = computed<number>(() => props.size / 2)
  const knobRadius = computed<number>(() => (props.size - knobStroke) / 2);

  const getCurrentValue = computed<string>(() => `${currentValue.value} ${props.unit}`)
  const getRotationAngle = computed<number>(() => {
    const startAngle = 45;      // Start Position: bottom left
    const totalRotation = 270;  // Rotation Range: 360° - 90°
    const percentage = (currentValue.value - props.min) / (props.max - props.min);

    return startAngle + (percentage * totalRotation);
  });
</script>


<template>
  <section
    class="knob"
    role="slider"
    :aria-valuenow="currentValue"
    :aria-valuemin="min"
    :aria-valuemax="max"
    :aria-label="label"
    tabindex="0"
    @keydown.up.prevent="handleKeyDown"
    @keydown.down.prevent="handleKeyDown"
    @keydown.right.prevent="handleKeyDown"
    @keydown.left.prevent="handleKeyDown"
  >
    <input
      type="range"
      v-model.number="currentValue"
      :min="min"
      :max="max"
      :aria-label="label"
      class="knob__input"
      @change="handleRelease"
    />

    <svg :width="size" :height="size" class="knop__ui">
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

    <span class="knob__value" aria-live="polite">{{ getCurrentValue }}</span>
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