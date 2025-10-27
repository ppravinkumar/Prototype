export interface PatchOption {
  id: string
  name: string
  label: string
}

export interface TargetOption {
  id: string
  name: string
}

export const PATCH_OPTIONS: PatchOption[] = [
  {
    id: '600201',
    name: 'CHROME-141.0.7390.122 (CVE-2025-31234, CVE-2025-31876)',
    label: '600201 - CHROME-141.0.7390.122 (CVE-2025-31234, CVE-2025-31876)'
  },
  {
    id: '600202',
    name: 'FIREFOX-144.0 (CVE-2025-24710, CVE-2025-24711)',
    label: '600202 - FIREFOX-144.0 (CVE-2025-24710, CVE-2025-24711)'
  },
  {
    id: '600203',
    name: 'ZOOM-6.2.0 (CVE-2025-58133)',
    label: '600203 - ZOOM-6.2.0 (CVE-2025-58133)'
  },
  {
    id: '600204',
    name: 'EDGE-141.0.3537.71 (CVE-2025-40210)',
    label: '600204 - EDGE-141.0.3537.71 (CVE-2025-40210)'
  },
  {
    id: '600205',
    name: 'SAFARI-18.1 (CVE-2025-30122, CVE-2025-30123)',
    label: '600205 - SAFARI-18.1 (CVE-2025-30122, CVE-2025-30123)'
  },
  {
    id: '600206',
    name: 'SLACK-4.44.120',
    label: '600206 - SLACK-4.44.120'
  },
  {
    id: '600207',
    name: 'ACROBAT-24.003.20284 (CVE-2025-41025)',
    label: '600207 - ACROBAT-24.003.20284 (CVE-2025-41025)'
  },
  {
    id: '600208',
    name: 'VSCODE-1.94.2',
    label: '600208 - VSCODE-1.94.2'
  }
]

export const TARGET_OPTIONS: TargetOption[] = [
  { id: 'finance', name: 'Finance' },
  { id: 'engineering', name: 'Engineering' },
  { id: 'it-admins', name: 'IT-Admins' },
  { id: 'qa-lab', name: 'QA-Lab' },
  { id: 'remote', name: 'Remote' },
  { id: 'pilot', name: 'Pilot' },
  { id: 'high-risk', name: 'High-Risk' },
  { id: 'all-devices', name: 'All-Devices' }
]

export type RebootOption = 'no_reboot' | 'if_required' | 'always'

export const PRE_REBOOT_OPTIONS: { value: RebootOption; label: string }[] = [
  { value: 'no_reboot', label: 'Do not Pre Reboot' },
  { value: 'if_required', label: 'Perform Pre Reboot if Required' },
  { value: 'always', label: 'Perform Pre Reboot' }
]

export const POST_REBOOT_OPTIONS: { value: RebootOption; label: string }[] = [
  { value: 'no_reboot', label: 'Do not Post Reboot' },
  { value: 'if_required', label: 'Perform Post Reboot if Required' },
  { value: 'always', label: 'Perform Post Reboot' }
]

export type NotificationOption = 'show_notifications' | 'no_notifications'

export const NOTIFICATION_OPTIONS: { value: NotificationOption; label: string }[] = [
  { value: 'show_notifications', label: 'Show Notification' },
  { value: 'no_notifications', label: 'Do Not Show Notifications' }
]
