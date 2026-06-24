# Generic Vue 3 Knob Meter Component

Dynamic Vue 3 Component to visualize a value as meter knob UI.
This component is a flexible UI element to visualize and change temperature data.

## Usage
```vue
<Knob :size="50" :min="20" :max="80" :initial-value="42" />
```

## Optional Parameters
- **min:** number = Minimum value
- **max:** number = Maximum value
- **size:** number = Dimension
- **label:** string = Label for screen reader
- **unit:** '°C' | 'F' = Temperature unit
- **initialValue:** number = Initial value
- **storageKey:** string = Key for localStorage to persist current value

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
- Sustainability: store value in localStorage

### State Transitions

- changed by user inteactions

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