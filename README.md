# Generic Vue 3 Knob Meter Component
![License](https://img.shields.io/badge/license-MIT-green)
![Vue](https://img.shields.io/badge/-Vue.js-4fc08d?style=flat&logo=vuedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/vite-646CFF?logo=vite&logoColor=white)
![SCSS](https://img.shields.io/badge/scss-CC6699?logo=sass&logoColor=white)

Dynamic Vue 3 Component to visualize a value as meter knob UI.
This component is a flexible UI element to visualize and change temperature data.

![Knob Component](./public/bright.png?raw=true "Vue 3 Knob Meter - bright")
![Knob Component](./public/dark.png?raw=true "Vue 3 Knob Meter - dark")

## Usage
```vue
<Knob :size="50" :min="20" :max="80" :target-value="42" />
```

## Optional Parameters
- **min:** number = Minimum value
- **max:** number = Maximum value
- **size:** number = Dimension
- **label:** string = Label for screen reader
- **unit:** '°C' | '°F' = Temperature unit
- **targetValue:** number = Initial value
- **interactive:** boolean = set component to read-only if set to `false`

## Default values
- **min:** `0`
- **max:** `100`
- **size:** `50`
- **label:** `Temperature Controller`
- **unit:** `°C`
- **targetValue:** `20`
- **interactive:** `false`

## Events
- **change:** void = triggered on mouse and key change

---

### Functional Requirements:

- Visualize a value as UI design element
- Add user interactions to change the current value (optional)


### Non-Functional Requirements

- Scalability: Easy to extend by interactions
- Flexibility: Values should be dynamic (min, max, value, unit)
- Error Handling & Fault tolerance: min < max, min <= current <= max
- Web accessibility: WCAG Level AA
- Testing: Related to error handling

### State Architecture

- Static values: minValue, maxValue, unit
- State value: currentValue as number

### State Transitions

- changed by user interactions

### Component Framework

- Vue 3
- TypeScript
- BEM
- Semantic HTML

---

## Report

### Time:
- Basic setup (Vite, Git, Frame): 15'
- UI design: 30'
- Calculation: 30'
- Event Handler: 45'
- Optimization: 30'
- Unit Tests (AI + Review): 15'
- Review: 30'
- Reporting: 15'

TOTAL: 3h 30'

### Issues:
- [FIXED] Spend too much time trying to align the min/max markers - solved it by giving the circle a background color
- [FIXED] Forgot to support dark mode
- [FIXED] Bug in the calculation - fixed with AI support
- [FIXED] Alias '@' does not work - fixed with AI support

### Improvements:
- Add validation library with schema (e.g. zod) or the component's props and pass errors to a global message handler
