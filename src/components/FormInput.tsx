import styles from './FormInput.module.css'

interface FormInputProps {
  label: string
  type?: 'text' | 'date' | 'time' | 'number' | 'select'
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
  placeholder?: string
  options?: string[]
}

function FormInput({
  label,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  placeholder,
  options = []
}: FormInputProps) {
  return (
    <div className={styles.formGroup}>
      <label className={styles.label}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>
      {type === 'select' ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${styles.input} ${error ? styles.inputError : ''}`}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${styles.input} ${error ? styles.inputError : ''}`}
          placeholder={placeholder}
        />
      )}
      {error && <span className={styles.error}>{error}</span>}
    </div>
  )
}

export default FormInput
