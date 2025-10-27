import styles from './RadioGroup.module.css'

interface RadioOption {
  id?: string
  value?: string
  name?: string
  label?: string
}

interface RadioGroupProps {
  label: string
  options: RadioOption[]
  value: string
  onChange: (value: string) => void
  name: string
  disabled?: boolean
}

function RadioGroup({ label, options, value, onChange, name, disabled = false }: RadioGroupProps) {
  return (
    <div className={`${styles.radioGroup} ${disabled ? styles.disabled : ''}`}>
      <label className={styles.label}>{label}</label>
      <div className={styles.options}>
        {options.map((option) => {
          const optionValue = option.value || option.id || ''
          const optionLabel = option.label || option.name || ''
          return (
            <label key={optionValue} className={styles.radioOption}>
              <input
                type="radio"
                name={name}
                value={optionValue}
                checked={value === optionValue}
                onChange={(e) => onChange(e.target.value)}
                className={styles.radioInput}
                disabled={disabled}
              />
              <span className={styles.radioLabel}>{optionLabel}</span>
            </label>
          )
        })}
      </div>
    </div>
  )
}

export default RadioGroup
