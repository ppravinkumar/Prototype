import styles from './Toggle.module.css'

interface ToggleProps {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
}

function Toggle({ label, checked, onChange }: ToggleProps) {
  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      <div
        className={`${styles.switch} ${checked ? styles.checked : ''}`}
        onClick={() => onChange(!checked)}
      >
        <input
          type="checkbox"
          className={styles.hiddenInput}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className={styles.slider} />
      </div>
    </div>
  )
}

export default Toggle
