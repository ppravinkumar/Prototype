import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FormInput from '../components/FormInput'
import MultiSelect from '../components/MultiSelect'
import RadioGroup from '../components/RadioGroup'
import {
  PATCH_OPTIONS,
  TARGET_OPTIONS,
  PRE_REBOOT_OPTIONS,
  POST_REBOOT_OPTIONS,
  NOTIFICATION_OPTIONS,
  DDM_PATCH_IDS,
  RebootOption,
  NotificationOption
} from '../constants/deploymentOptions'
import { supabase } from '../lib/supabase'
import styles from './ManualDeploymentCreate.module.css'

interface FormData {
  deploymentName: string
  selectedPatches: string[]
  isCustomised: boolean
  forceInstallEnabled: boolean
  forceInstallDate: string
  forceInstallTime: string
  preRebootOption: RebootOption
  postRebootOption: RebootOption
  notificationOption: NotificationOption
  selectedTargets: string[]
  ddmForceInstallDate: string
  ddmForceInstallTime: string
}

interface FormErrors {
  deploymentName?: string
  selectedPatches?: string
  selectedTargets?: string
  ddmForceInstallDate?: string
  ddmForceInstallTime?: string
}

function ManualDeploymentCreate() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [formData, setFormData] = useState<FormData>({
    deploymentName: '',
    selectedPatches: [],
    isCustomised: false,
    forceInstallEnabled: true,
    forceInstallDate: '',
    forceInstallTime: '',
    preRebootOption: 'no_reboot',
    postRebootOption: 'no_reboot',
    notificationOption: 'show_notifications',
    selectedTargets: [],
    ddmForceInstallDate: '',
    ddmForceInstallTime: ''
  })

  const [errors, setErrors] = useState<FormErrors>({})

  const hasDDMPatches = formData.selectedPatches.some(patchId => DDM_PATCH_IDS.includes(patchId))

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.deploymentName.trim()) {
      newErrors.deploymentName = 'Deployment name is required'
    }

    if (formData.selectedPatches.length === 0) {
      newErrors.selectedPatches = 'At least one patch must be selected'
    }

    if (formData.selectedTargets.length === 0) {
      newErrors.selectedTargets = 'At least one target group must be selected'
    }

    if (hasDDMPatches) {
      if (!formData.ddmForceInstallDate) {
        newErrors.ddmForceInstallDate = 'DDM Force Install Date is required when DDM patches are selected'
      }
      if (!formData.ddmForceInstallTime) {
        newErrors.ddmForceInstallTime = 'DDM Force Install Time is required when DDM patches are selected'
      }
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
      const { data: deployment, error: deploymentError } = await supabase
        .from('manual_deployments')
        .insert({
          deployment_name: formData.deploymentName,
          is_customised: formData.isCustomised,
          force_install_enabled: formData.isCustomised ? formData.forceInstallEnabled : true,
          force_install_date: formData.isCustomised && formData.forceInstallEnabled && formData.forceInstallDate ? formData.forceInstallDate : null,
          force_install_time: formData.isCustomised && formData.forceInstallEnabled && formData.forceInstallTime ? formData.forceInstallTime : null,
          pre_reboot_option: formData.isCustomised ? formData.preRebootOption : 'no_reboot',
          post_reboot_option: formData.isCustomised ? formData.postRebootOption : 'no_reboot',
          show_notifications: formData.isCustomised ? (formData.notificationOption === 'show_notifications') : true,
          status: 'pending'
        })
        .select()
        .single()

      if (deploymentError) throw deploymentError

      const patchInserts = formData.selectedPatches.map((patchId) => {
        const patch = PATCH_OPTIONS.find((p) => p.id === patchId)
        return {
          deployment_id: deployment.id,
          patch_id: patchId,
          patch_name: patch?.name || ''
        }
      })

      const { error: patchesError } = await supabase
        .from('deployment_patches')
        .insert(patchInserts)

      if (patchesError) throw patchesError

      const targetInserts = formData.selectedTargets.map((targetId) => {
        const target = TARGET_OPTIONS.find((t) => t.id === targetId)
        return {
          deployment_id: deployment.id,
          target_group: target?.name || ''
        }
      })

      const { error: targetsError } = await supabase
        .from('deployment_targets')
        .insert(targetInserts)

      if (targetsError) throw targetsError

      if (hasDDMPatches && formData.ddmForceInstallDate && formData.ddmForceInstallTime) {
        const { error: ddmError } = await supabase
          .from('deployment_ddm_customization')
          .insert({
            deployment_id: deployment.id,
            ddm_force_install_date: formData.ddmForceInstallDate,
            ddm_force_install_time: formData.ddmForceInstallTime
          })

        if (ddmError) throw ddmError
      }

      navigate('/deployment/manual')
    } catch (error) {
      console.error('Error creating deployment:', error)
      setSubmitError('Failed to create deployment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    navigate('/deployment/manual')
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Create Manual Deployment</h1>
        <p className={styles.subtitle}>Configure and schedule a new manual patch deployment.</p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.section}>
          <FormInput
            label="Deployment Name"
            value={formData.deploymentName}
            onChange={(value) => setFormData({ ...formData, deploymentName: value })}
            error={errors.deploymentName}
            required
            placeholder="Enter deployment name"
          />

          <MultiSelect
            label="Patches"
            options={PATCH_OPTIONS}
            value={formData.selectedPatches}
            onChange={(value) => setFormData({ ...formData, selectedPatches: value })}
            error={errors.selectedPatches}
            required
            placeholder="Search patches..."
          />
        </div>

        {hasDDMPatches && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>DDM Customisation</h3>
            <p className={styles.sectionDescription}>
              Configure force install settings for Apple DDM patches (macOS updates and upgrades).
            </p>

            <div className={styles.dateTimeRow}>
              <FormInput
                label="Force Install After — Date"
                type="date"
                value={formData.ddmForceInstallDate}
                onChange={(value) => setFormData({ ...formData, ddmForceInstallDate: value })}
                error={errors.ddmForceInstallDate}
                required
              />

              <FormInput
                label="Force Install After — Time"
                type="time"
                value={formData.ddmForceInstallTime}
                onChange={(value) => setFormData({ ...formData, ddmForceInstallTime: value })}
                error={errors.ddmForceInstallTime}
                required
              />
            </div>
          </div>
        )}

        <div className={styles.section}>
          <div className={styles.customizationHeader}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.isCustomised}
                onChange={(e) => setFormData({ ...formData, isCustomised: e.target.checked })}
                className={styles.checkbox}
              />
              <span className={styles.checkboxText}>Enable Customization</span>
            </label>
          </div>

          {formData.isCustomised && (
            <div className={styles.customizationFields}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.forceInstallEnabled}
                  onChange={(e) => setFormData({ ...formData, forceInstallEnabled: e.target.checked })}
                  className={styles.checkbox}
                />
                <span className={styles.checkboxText}>Enable Force Install</span>
              </label>

              <div className={styles.dateTimeRow}>
                <FormInput
                  label="Force Install After — Date"
                  type="date"
                  value={formData.forceInstallDate}
                  onChange={(value) => setFormData({ ...formData, forceInstallDate: value })}
                  disabled={!formData.forceInstallEnabled}
                />

                <FormInput
                  label="Force Install After — Time"
                  type="time"
                  value={formData.forceInstallTime}
                  onChange={(value) => setFormData({ ...formData, forceInstallTime: value })}
                  disabled={!formData.forceInstallEnabled}
                />
              </div>

              <RadioGroup
                label="Pre Reboot"
                name="preReboot"
                options={PRE_REBOOT_OPTIONS}
                value={formData.preRebootOption}
                onChange={(value) => setFormData({ ...formData, preRebootOption: value as RebootOption })}
              />

              <RadioGroup
                label="Post Reboot"
                name="postReboot"
                options={POST_REBOOT_OPTIONS}
                value={formData.postRebootOption}
                onChange={(value) => setFormData({ ...formData, postRebootOption: value as RebootOption })}
              />

              <RadioGroup
                label="Show Notification"
                name="notification"
                options={NOTIFICATION_OPTIONS}
                value={formData.notificationOption}
                onChange={(value) => setFormData({ ...formData, notificationOption: value as NotificationOption })}
              />
            </div>
          )}
        </div>

        <div className={styles.section}>
          <MultiSelect
            label="Targets (Custom Groups)"
            options={TARGET_OPTIONS}
            value={formData.selectedTargets}
            onChange={(value) => setFormData({ ...formData, selectedTargets: value })}
            error={errors.selectedTargets}
            required
            placeholder="Search target groups..."
          />
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

export default ManualDeploymentCreate
