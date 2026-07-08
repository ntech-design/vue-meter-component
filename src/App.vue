<script setup lang="ts">
  import { ref } from 'vue'
  import Knob from '@/components/Knob/Knob.vue'
  import Notify from '@/components/Notify/Notify.vue'

  const currentTemperature = ref(42)

  const handleKnobChange = (newValue: number) => {
    currentTemperature.value = newValue
    console.log('New value:', newValue)
  }
</script>

<template>
  <Knob
    :size="50"
    :min="20"
    :max="80"
    :interactive="true"
    :target-value="currentTemperature"
    @change="handleKnobChange"
  />

  <Notify />
</template>
