import styles from './RadioGroup.module.css'

interface RadioOption {
  value: string
  label: string
}

interface RadioGroupProps {
  label: string
  options: RadioOption[]
  value: string
  onChange: (value: string) => void
  name: string
}

function RadioGroup({ label, options, value, onChange, name }: RadioGroupProps) {
  return (
    <div className={styles.radioGroup}>
      <label className={styles.label}>{label}</label>
      <div className={styles.options}>
        {options.map((option) => (
          <label key={option.value} className={styles.radioOption}>
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className={styles.radioInput}
            />
            <span className={styles.radioLabel}>{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  )
}

export default RadioGroup
