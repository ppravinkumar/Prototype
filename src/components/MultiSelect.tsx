import { useState, useRef, useEffect } from 'react'
import styles from './MultiSelect.module.css'

interface Option {
  id: string
  name: string
  label?: string
}

interface MultiSelectProps {
  label: string
  options: Option[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  required?: boolean
  error?: string
}

function MultiSelect({
  label,
  options,
  value,
  onChange,
  placeholder = 'Search and select...',
  required = false,
  error
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredOptions = options.filter((option) =>
    (option.label || option.name).toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleOption = (optionId: string) => {
    if (value.includes(optionId)) {
      onChange(value.filter((id) => id !== optionId))
    } else {
      onChange([...value, optionId])
    }
  }

  const removeOption = (optionId: string) => {
    onChange(value.filter((id) => id !== optionId))
  }

  const getSelectedOptions = () => {
    return options.filter((option) => value.includes(option.id))
  }

  return (
    <div className={styles.multiSelect} ref={dropdownRef}>
      <label className={styles.label}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>

      <div className={styles.selectedItems}>
        {getSelectedOptions().map((option) => (
          <div key={option.id} className={styles.tag}>
            <span className={styles.tagText}>{option.name}</span>
            <button
              type="button"
              className={styles.tagRemove}
              onClick={() => removeOption(option.id)}
              aria-label={`Remove ${option.name}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className={styles.inputWrapper}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={`${styles.input} ${error ? styles.inputError : ''}`}
        />
        {value.length > 0 && (
          <span className={styles.badge}>{value.length} selected</span>
        )}
      </div>

      {error && <span className={styles.error}>{error}</span>}

      {isOpen && (
        <div className={styles.dropdown}>
          {filteredOptions.length === 0 ? (
            <div className={styles.noResults}>No options found</div>
          ) : (
            filteredOptions.map((option) => (
              <label key={option.id} className={styles.option}>
                <input
                  type="checkbox"
                  checked={value.includes(option.id)}
                  onChange={() => toggleOption(option.id)}
                  className={styles.checkbox}
                />
                <span className={styles.optionText}>{option.label || option.name}</span>
              </label>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default MultiSelect
