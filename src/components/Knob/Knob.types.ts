export interface KnobProps {
  min?: number
  max?: number
  size?: number
  label?: string
  unit?: '°C' | '°F'
  targetValue?: number
  interactive?: boolean
}

export type KnobEmits = {
  change: [value: number]
}
