import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FormInput from '../components/FormInput'
import MultiSelect from '../components/MultiSelect'
import styles from './AutonomousDeploymentCreate.module.css'

type StartOption = 'days' | 'weekDay' | 'patchTuesday' | 'calendarDay'

interface WeekDayEntry {
  id: string
  week: string
  day: string
}

interface PatchTuesdayEntry {
  id: string
  offset: string
  day: string
}

interface RingData {
  id: string
  ringNumber: number
  name: string
  targets: string[]
  passCriteria?: number
  waitDays?: number
}

interface FormData {
  deploymentName: string
  applications: string[]
  startOption: StartOption
  daysAfterRelease: number
  weekDayEntries: WeekDayEntry[]
  patchTuesdayEntries: PatchTuesdayEntry[]
  calendarDay: string
  rings: RingData[]
}

interface FormErrors {
  [key: string]: string | undefined
}

const APPLICATION_OPTIONS = [
  { id: 'chrome', name: 'Google Chrome' },
  { id: 'slack', name: 'Slack' },
  { id: 'zoom', name: 'Zoom' },
  { id: 'vscode', name: 'Visual Studio Code' },
  { id: 'firefox', name: 'Firefox' }
]

const TARGET_OPTIONS = [
  { id: 'it-lab-macos', name: 'IT Lab (macOS)' },
  { id: 'engineering-macbooks', name: 'Engineering MacBooks' },
  { id: 'qa-pool', name: 'QA Pool' },
  { id: 'dev-team', name: 'Dev Team' },
  { id: 'marketing', name: 'Marketing' },
  { id: 'sales', name: 'Sales' }
]

const WEEK_OPTIONS = ['1', '2', '3', '4', 'last']
const DAY_OPTIONS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const CALENDAR_DAY_OPTIONS = Array.from({ length: 28 }, (_, i) => (i + 1).toString()).concat('last')

function getRingName(ringNumber: number, totalRings: number): string {
  if (ringNumber === 1) {
    return 'Ring 1 — Internal users'
  }
  if (ringNumber === totalRings) {
    return `Ring ${ringNumber} — All Users`
  }
  if (ringNumber === 2 && totalRings > 2) {
    return 'Ring 2 — Early adopters'
  }
  return `Ring ${ringNumber}`
}

function AutonomousDeploymentCreate() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [formData, setFormData] = useState<FormData>({
    deploymentName: '',
    applications: [],
    startOption: 'days',
    daysAfterRelease: 0,
    weekDayEntries: [],
    patchTuesdayEntries: [],
    calendarDay: '1',
    rings: [
      {
        id: '1',
        ringNumber: 1,
        name: 'Ring 1 — Internal users',
        targets: [],
        passCriteria: undefined,
        waitDays: undefined
      }
    ]
  })

  const [errors, setErrors] = useState<FormErrors>({})

  const [newWeekDayEntry, setNewWeekDayEntry] = useState({ week: '1', day: 'Mon' })
  const [newPatchTuesdayEntry, setNewPatchTuesdayEntry] = useState({ offset: '0', day: 'Mon' })

  const addWeekDayEntry = () => {
    const duplicate = formData.weekDayEntries.find(
      e => e.week === newWeekDayEntry.week && e.day === newWeekDayEntry.day
    )
    if (duplicate) {
      setErrors({ ...errors, weekDay: `Week ${newWeekDayEntry.week} ${newWeekDayEntry.day} already added` })
      return
    }
    setFormData({
      ...formData,
      weekDayEntries: [...formData.weekDayEntries, { ...newWeekDayEntry, id: Date.now().toString() }]
    })
    setErrors({ ...errors, weekDay: undefined })
  }

  const removeWeekDayEntry = (id: string) => {
    setFormData({
      ...formData,
      weekDayEntries: formData.weekDayEntries.filter(e => e.id !== id)
    })
  }

  const addPatchTuesdayEntry = () => {
    const duplicate = formData.patchTuesdayEntries.find(
      e => e.offset === newPatchTuesdayEntry.offset && e.day === newPatchTuesdayEntry.day
    )
    if (duplicate) {
      setErrors({ ...errors, patchTuesday: `${newPatchTuesdayEntry.offset} ${newPatchTuesdayEntry.day} already added` })
      return
    }
    setFormData({
      ...formData,
      patchTuesdayEntries: [...formData.patchTuesdayEntries, { ...newPatchTuesdayEntry, id: Date.now().toString() }]
    })
    setErrors({ ...errors, patchTuesday: undefined })
  }

  const removePatchTuesdayEntry = (id: string) => {
    setFormData({
      ...formData,
      patchTuesdayEntries: formData.patchTuesdayEntries.filter(e => e.id !== id)
    })
  }

  const addRing = () => {
    const newRingNumber = formData.rings.length + 1
    const newId = Date.now().toString()
    const newRings = [...formData.rings]

    newRings.push({
      id: newId,
      ringNumber: newRingNumber,
      name: getRingName(newRingNumber, newRingNumber),
      targets: [],
      passCriteria: undefined,
      waitDays: undefined
    })

    const updatedRings = newRings.map((ring, index) => ({
      ...ring,
      ringNumber: index + 1,
      name: getRingName(index + 1, newRings.length)
    }))

    setFormData({ ...formData, rings: updatedRings })
  }

  const deleteRing = (ringId: string) => {
    if (formData.rings.length <= 1) return

    const newRings = formData.rings.filter(r => r.id !== ringId)
    const updatedRings = newRings.map((ring, index) => ({
      ...ring,
      ringNumber: index + 1,
      name: getRingName(index + 1, newRings.length)
    }))

    setFormData({ ...formData, rings: updatedRings })
  }

  const updateRing = (ringId: string, updates: Partial<RingData>) => {
    const updatedRings = formData.rings.map(ring =>
      ring.id === ringId ? { ...ring, ...updates } : ring
    )
    setFormData({ ...formData, rings: updatedRings })
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.deploymentName.trim()) {
      newErrors.deploymentName = 'Deployment name is required'
    }

    if (formData.applications.length === 0) {
      newErrors.applications = 'At least one application must be selected'
    }

    if (formData.startOption === 'weekDay' && formData.weekDayEntries.length === 0) {
      newErrors.weekDay = 'At least one week/day entry is required'
    }

    if (formData.startOption === 'patchTuesday' && formData.patchTuesdayEntries.length === 0) {
      newErrors.patchTuesday = 'At least one offset/day entry is required'
    }

    formData.rings.forEach((ring, index) => {
      if (ring.targets.length === 0) {
        newErrors[`ring${ring.id}Targets`] = `${ring.name} has no targets`
      }

      const isFinalRing = index === formData.rings.length - 1
      if (!isFinalRing) {
        if (!ring.passCriteria || ring.passCriteria < 1 || ring.passCriteria > 100) {
          newErrors[`ring${ring.id}Pass`] = `Provide ${ring.name} pass criteria % as integer 1-100`
        }

        if (ring.waitDays === undefined || ring.waitDays < 0) {
          newErrors[`ring${ring.id}Wait`] = `Provide ${ring.name} wait days as integer ≥ 0`
        }
      }
    })

    const allTargets = formData.rings.flatMap(ring => ring.targets)
    const duplicates = allTargets.filter((item, index) => allTargets.indexOf(item) !== index)
    if (duplicates.length > 0) {
      newErrors.targetOverlap = 'Targets overlap between rings. Remove duplicates.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      console.log('Creating deployment:', formData)
      await new Promise(resolve => setTimeout(resolve, 1000))
      navigate('/deployment/autonomous')
    } catch (error) {
      console.error('Error creating deployment:', error)
      setSubmitError('Failed to create deployment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate('/deployment/autonomous')
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Create Deployment</h1>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.section}>
          <div className={styles.fieldGroup}>
            <FormInput
              label="Deployment Name"
              value={formData.deploymentName}
              onChange={(value) => setFormData({ ...formData, deploymentName: value })}
              error={errors.deploymentName}
              required
              placeholder="Monthly App Patch"
            />

            <MultiSelect
              label="Applications"
              options={APPLICATION_OPTIONS}
              value={formData.applications}
              onChange={(value) => setFormData({ ...formData, applications: value })}
              error={errors.applications}
              required
              placeholder="Search applications..."
            />
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '-8px 0 0 0' }}>
              Patches approved for these applications are considered.
            </p>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Start deployment (from Release)</h3>
          <p className={styles.sectionDescription}>
            Choose when this deployment may start. All boundaries are calculated from each item's release. No time picker; Ring 1 opens when the boundary becomes true, install timing/queuing is handled by the engine.
          </p>

          <div className={styles.radioGroup}>
            <div className={`${styles.radioOption} ${formData.startOption === 'days' ? styles.selected : ''}`}>
              <div className={styles.radioHeader} onClick={() => setFormData({ ...formData, startOption: 'days' })}>
                <input
                  type="radio"
                  name="startOption"
                  value="days"
                  checked={formData.startOption === 'days'}
                  onChange={(e) => setFormData({ ...formData, startOption: e.target.value as StartOption })}
                  className={styles.radioInput}
                />
                <label className={styles.radioLabel}>X Days after Release</label>
              </div>
              <p className={styles.radioHelper}>Begins when the item has been released for X full days.</p>
              {formData.startOption === 'days' && (
                <div className={styles.radioFields}>
                  <FormInput
                    label="Days (X)"
                    type="number"
                    value={formData.daysAfterRelease.toString()}
                    onChange={(value) => setFormData({ ...formData, daysAfterRelease: parseInt(value) || 0 })}
                    placeholder="0"
                  />
                </div>
              )}
            </div>

            <div className={`${styles.radioOption} ${formData.startOption === 'weekDay' ? styles.selected : ''}`}>
              <div className={styles.radioHeader} onClick={() => setFormData({ ...formData, startOption: 'weekDay' })}>
                <input
                  type="radio"
                  name="startOption"
                  value="weekDay"
                  checked={formData.startOption === 'weekDay'}
                  onChange={(e) => setFormData({ ...formData, startOption: e.target.value as StartOption })}
                  className={styles.radioInput}
                />
                <label className={styles.radioLabel}>Week & Day after Release</label>
              </div>
              <p className={styles.radioHelper}>Begins when the first selected week/day boundary after release is reached.</p>
              {formData.startOption === 'weekDay' && (
                <div className={styles.radioFields}>
                  {formData.weekDayEntries.length > 0 && (
                    <div className={styles.entryList}>
                      {formData.weekDayEntries.map(entry => (
                        <div key={entry.id} className={styles.entryPill}>
                          Week {entry.week} {entry.day}
                          <button
                            type="button"
                            onClick={() => removeWeekDayEntry(entry.id)}
                            className={styles.removePill}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className={styles.inlineFields}>
                    <FormInput
                      label="Week"
                      type="select"
                      value={newWeekDayEntry.week}
                      onChange={(value) => setNewWeekDayEntry({ ...newWeekDayEntry, week: value })}
                      options={WEEK_OPTIONS}
                    />
                    <FormInput
                      label="Day"
                      type="select"
                      value={newWeekDayEntry.day}
                      onChange={(value) => setNewWeekDayEntry({ ...newWeekDayEntry, day: value })}
                      options={DAY_OPTIONS}
                    />
                    <button type="button" onClick={addWeekDayEntry} className={styles.addEntryButton} style={{ marginTop: '24px' }}>
                      + Add Entry
                    </button>
                  </div>
                  {errors.weekDay && <div className={styles.errorText}>{errors.weekDay}</div>}
                </div>
              )}
            </div>

            <div className={`${styles.radioOption} ${formData.startOption === 'patchTuesday' ? styles.selected : ''}`}>
              <div className={styles.radioHeader} onClick={() => setFormData({ ...formData, startOption: 'patchTuesday' })}>
                <input
                  type="radio"
                  name="startOption"
                  value="patchTuesday"
                  checked={formData.startOption === 'patchTuesday'}
                  onChange={(e) => setFormData({ ...formData, startOption: e.target.value as StartOption })}
                  className={styles.radioInput}
                />
                <label className={styles.radioLabel}>Week & Day (Patch Tuesday) after Release</label>
              </div>
              <p className={styles.radioHelper}>Relative to Patch Tuesday (UTC). Triggers when the chosen offset/day boundary after release is crossed.</p>
              {formData.startOption === 'patchTuesday' && (
                <div className={styles.radioFields}>
                  {formData.patchTuesdayEntries.length > 0 && (
                    <div className={styles.entryList}>
                      {formData.patchTuesdayEntries.map(entry => (
                        <div key={entry.id} className={styles.entryPill}>
                          {entry.offset} {entry.day}
                          <button
                            type="button"
                            onClick={() => removePatchTuesdayEntry(entry.id)}
                            className={styles.removePill}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className={styles.inlineFields}>
                    <FormInput
                      label="Offset (weeks)"
                      type="number"
                      value={newPatchTuesdayEntry.offset}
                      onChange={(value) => setNewPatchTuesdayEntry({ ...newPatchTuesdayEntry, offset: value })}
                      placeholder="0"
                    />
                    <FormInput
                      label="Day"
                      type="select"
                      value={newPatchTuesdayEntry.day}
                      onChange={(value) => setNewPatchTuesdayEntry({ ...newPatchTuesdayEntry, day: value })}
                      options={DAY_OPTIONS}
                    />
                    <button type="button" onClick={addPatchTuesdayEntry} className={styles.addEntryButton} style={{ marginTop: '24px' }}>
                      + Add Entry
                    </button>
                  </div>
                  {errors.patchTuesday && <div className={styles.errorText}>{errors.patchTuesday}</div>}
                </div>
              )}
            </div>

            <div className={`${styles.radioOption} ${formData.startOption === 'calendarDay' ? styles.selected : ''}`}>
              <div className={styles.radioHeader} onClick={() => setFormData({ ...formData, startOption: 'calendarDay' })}>
                <input
                  type="radio"
                  name="startOption"
                  value="calendarDay"
                  checked={formData.startOption === 'calendarDay'}
                  onChange={(e) => setFormData({ ...formData, startOption: e.target.value as StartOption })}
                  className={styles.radioInput}
                />
                <label className={styles.radioLabel}>Calendar Day of Month after Release</label>
              </div>
              <p className={styles.radioHelper}>Begins when the selected calendar day boundary after release is reached.</p>
              {formData.startOption === 'calendarDay' && (
                <div className={styles.radioFields}>
                  <FormInput
                    label="Day of month"
                    type="select"
                    value={formData.calendarDay}
                    onChange={(value) => setFormData({ ...formData, calendarDay: value })}
                    options={CALENDAR_DAY_OPTIONS}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Rings</h3>
          <p className={styles.sectionDescription}>
            Starting with 1 to N number of rings. Each ring has its own targets. Devices must not appear in more than one ring.
          </p>
          {errors.targetOverlap && <div className={styles.errorText}>{errors.targetOverlap}</div>}

          <div className={styles.ringsContainer}>
            {formData.rings.map((ring, index) => {
              const isFinalRing = index === formData.rings.length - 1
              const showDeleteButton = formData.rings.length > 1
              const previousRingName = index > 0 ? formData.rings[index - 1].name : ''

              return (
                <div key={ring.id} className={styles.ringCard}>
                  <div className={styles.ringCardHeader}>
                    <h4 className={styles.ringHeader}>{ring.name}</h4>
                    {showDeleteButton && (
                      <button
                        type="button"
                        onClick={() => deleteRing(ring.id)}
                        className={styles.deleteRingButton}
                        title="Delete ring"
                      >
                        ×
                      </button>
                    )}
                  </div>
                  <MultiSelect
                    label="Targets"
                    options={TARGET_OPTIONS}
                    value={ring.targets}
                    onChange={(value) => updateRing(ring.id, { targets: value })}
                    error={errors[`ring${ring.id}Targets`]}
                    required
                    placeholder="Search targets..."
                  />
                  {!isFinalRing && (
                    <>
                      <FormInput
                        label="Pass criteria % (Installed)"
                        type="number"
                        value={ring.passCriteria?.toString() || ''}
                        onChange={(value) => updateRing(ring.id, { passCriteria: parseInt(value) || undefined })}
                        error={errors[`ring${ring.id}Pass`]}
                        required
                        placeholder="60"
                      />
                      <p style={{ fontSize: '13px', color: '#6B7280', margin: '-8px 0 0 0' }}>
                        {index === 0
                          ? 'When this ring reaches the pass % Installed, the next ring begins.'
                          : 'Opens when previous ring passes. When this ring reaches the pass %, the next ring begins.'}
                      </p>
                      <FormInput
                        label="Wait days for % calculation"
                        type="number"
                        value={ring.waitDays?.toString() || ''}
                        onChange={(value) => updateRing(ring.id, { waitDays: parseInt(value) || undefined })}
                        error={errors[`ring${ring.id}Wait`]}
                        required
                        placeholder="0"
                      />
                      <p style={{ fontSize: '13px', color: '#6B7280', margin: '-8px 0 0 0' }}>
                        We begin evaluating this ring's Installed % N days after it starts. After that, the % counts only devices targeted for at least N days. Once passed, it stays passed (latched).
                      </p>
                    </>
                  )}
                  {isFinalRing && (
                    <p className={styles.ringNote}>
                      {index === 0 ? 'This is the only ring.' : `Opens when ${previousRingName} passes.`}
                    </p>
                  )}
                  {!isFinalRing && <div className={styles.ringArrow}>→</div>}
                </div>
              )
            })}
          </div>

          <button
            type="button"
            onClick={addRing}
            className={styles.addRingButton}
          >
            + Add Ring
          </button>
        </div>

        {submitError && (
          <div className={styles.submitError}>{submitError}</div>
        )}

        <div className={styles.actions}>
          <button
            type="button"
            onClick={handleCancel}
            className={styles.cancelButton}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Deployment'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AutonomousDeploymentCreate
