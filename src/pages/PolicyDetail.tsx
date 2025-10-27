import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import FormInput from '../components/FormInput'
import Toggle from '../components/Toggle'
import RadioGroup from '../components/RadioGroup'
import styles from './PolicyDetail.module.css'

interface MachineAgentPolicy {
  enableForce: boolean
  forceDays: number
  forceTime: string
  retryEnabled: boolean
  retryMax: number
  preReboot: string
  postReboot: string
  notify: string
}

interface MachineDDMPolicy {
  ddmForceDays: number
  ddmForceTime: string
}

interface AppAgentRow {
  id: string
  app: string
  force: string
  retry: string
  max: string
  pre: string
  post: string
  notif: string
  preScript: string
  postScript: string
}

interface AppDDMRow {
  id: string
  channel: string
  force: string
}

interface CustomGroupData {
  id: string
  name: string
  platform: 'macOS' | 'Windows'
  machineAgent: MachineAgentPolicy
  machineDDM: MachineDDMPolicy
  appAgentRows: AppAgentRow[]
  appDDMRows: AppDDMRow[]
}

const SAMPLE_DATA: Record<string, CustomGroupData> = {
  cg_001: {
    id: 'cg_001',
    name: 'macOS Workstations',
    platform: 'macOS',
    machineAgent: {
      enableForce: true,
      forceDays: 7,
      forceTime: '10:00',
      retryEnabled: true,
      retryMax: 3,
      preReboot: 'Yes',
      postReboot: 'Yes',
      notify: 'Yes'
    },
    machineDDM: {
      ddmForceDays: 5,
      ddmForceTime: '10:00'
    },
    appAgentRows: [
      { id: '1', app: 'Chrome', force: '2 Days + 10:00', retry: 'Yes', max: '2', pre: 'No', post: 'No', notif: 'Yes', preScript: '[]', postScript: 'verify.sh' },
      { id: '2', app: 'Firefox', force: '4 Days + 10:00', retry: 'Yes', max: '3', pre: 'Yes', post: 'Yes', notif: 'Yes', preScript: 'closeFF.sh', postScript: 'restartFF.sh' },
      { id: '3', app: 'Zoom', force: 'Inherit', retry: 'Inherit', max: 'Inherit', pre: 'Inherit', post: 'Inherit', notif: 'Inherit', preScript: '[]', postScript: '[]' }
    ],
    appDDMRows: [
      { id: '1', channel: 'macOS Upgrade', force: '30 Days + 10:00' },
      { id: '2', channel: 'macOS Tahoe', force: '14 Days + 10:00' },
      { id: '3', channel: 'macOS Sonoma', force: '7 Days + 10:00' }
    ]
  },
  cg_003: {
    id: 'cg_003',
    name: 'Windows Servers',
    platform: 'Windows',
    machineAgent: {
      enableForce: false,
      forceDays: 0,
      forceTime: '10:00',
      retryEnabled: false,
      retryMax: 3,
      preReboot: 'No',
      postReboot: 'No',
      notify: 'No'
    },
    machineDDM: {
      ddmForceDays: 10,
      ddmForceTime: '10:00'
    },
    appAgentRows: [
      { id: '1', app: 'SQL Server', force: 'No', retry: 'No', max: '–', pre: 'Yes', post: 'Yes', notif: 'No', preScript: 'backupDB.sh', postScript: 'verifyDB.sh' },
      { id: '2', app: 'IIS Service', force: 'No', retry: 'No', max: '–', pre: 'Yes', post: 'Yes', notif: 'No', preScript: 'stopIIS.sh', postScript: 'startIIS.sh' },
      { id: '3', app: 'Apache', force: 'No', retry: 'No', max: '–', pre: 'Yes', post: 'Yes', notif: 'No', preScript: 'backupConf.sh', postScript: 'reloadApache.sh' }
    ],
    appDDMRows: []
  },
  cg_004: {
    id: 'cg_004',
    name: 'Windows Workstations',
    platform: 'Windows',
    machineAgent: {
      enableForce: true,
      forceDays: 7,
      forceTime: '10:00',
      retryEnabled: true,
      retryMax: 3,
      preReboot: 'Yes',
      postReboot: 'Yes',
      notify: 'Yes'
    },
    machineDDM: {
      ddmForceDays: 5,
      ddmForceTime: '10:00'
    },
    appAgentRows: [
      { id: '1', app: 'Chrome', force: '3 Days + 10:00', retry: 'Inherit', max: 'Inherit', pre: 'Inherit', post: 'Inherit', notif: 'Inherit', preScript: '[]', postScript: 'open_chrome.sh' },
      { id: '2', app: 'Firefox', force: '3 Days + 10:00', retry: 'Inherit', max: 'Inherit', pre: 'Inherit', post: 'Inherit', notif: 'Inherit', preScript: '[]', postScript: 'restartFF.sh' },
      { id: '3', app: 'Edge', force: '3 Days + 10:00', retry: 'Inherit', max: 'Inherit', pre: 'Inherit', post: 'Inherit', notif: 'Inherit', preScript: '[]', postScript: 'open_edge.sh' },
      { id: '4', app: 'Safari', force: '3 Days + 10:00', retry: 'Inherit', max: 'Inherit', pre: 'Inherit', post: 'Inherit', notif: 'Inherit', preScript: '[]', postScript: 'open_safari.sh' }
    ],
    appDDMRows: []
  }
}

const CG_OPTIONS = [
  { id: 'cg_001', name: 'macOS Workstations' },
  { id: 'cg_002', name: 'macOS Leads – Do Not Disturb' },
  { id: 'cg_003', name: 'Windows Servers' },
  { id: 'cg_004', name: 'Windows Workstations' },
  { id: 'cg_005', name: 'Default Group' }
]

function PolicyDetail() {
  const { cgId } = useParams<{ cgId: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'machine' | 'application'>('machine')
  const [isDirty, setIsDirty] = useState(false)

  const currentData = SAMPLE_DATA[cgId || 'cg_001'] || SAMPLE_DATA['cg_001']
  const [machineAgent, setMachineAgent] = useState(currentData.machineAgent)
  const [machineDDM, setMachineDDM] = useState(currentData.machineDDM)

  const handleCGChange = (newCgId: string) => {
    if (isDirty) {
      const confirm = window.confirm('You have unsaved changes. Discard them?')
      if (!confirm) return
    }
    navigate(`/policy/${newCgId}`)
  }

  const handleDiscard = () => {
    setIsDirty(false)
    setMachineAgent(currentData.machineAgent)
    setMachineDDM(currentData.machineDDM)
  }

  const handleSave = () => {
    console.log('Saving policy:', { machineAgent, machineDDM })
    setIsDirty(false)
  }

  const updateMachineAgent = (updates: Partial<MachineAgentPolicy>) => {
    setMachineAgent({ ...machineAgent, ...updates })
    setIsDirty(true)
  }

  const updateMachineDDM = (updates: Partial<MachineDDMPolicy>) => {
    setMachineDDM({ ...machineDDM, ...updates })
    setIsDirty(true)
  }

  const isMacOS = currentData.platform === 'macOS'

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>{currentData.name}</h1>
          <span className={styles.helperBadge}>Inheritance: Application ⟶ Machine</span>
        </div>
        <select
          className={styles.cgSelector}
          value={cgId}
          onChange={(e) => handleCGChange(e.target.value)}
        >
          <option value="">Switch CG</option>
          {CG_OPTIONS.map((cg) => (
            <option key={cg.id} value={cg.id}>
              {cg.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'machine' ? styles.active : ''} ${isDirty && activeTab === 'machine' ? styles.dirty : ''}`}
          onClick={() => setActiveTab('machine')}
        >
          Machine Policy
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'application' ? styles.active : ''}`}
          onClick={() => setActiveTab('application')}
        >
          Application Policy
        </button>
      </div>

      <div className={`${styles.tabContent} ${activeTab === 'machine' ? styles.active : ''}`}>
        <div className={`${styles.grid} ${styles.gridCols2}`}>
          <div className={styles.box}>
            <div className={styles.boxHeader}>
              <h3 className={styles.boxTitle}>General Patch Behaviour (via EC Agent)</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Toggle
                label="Enable Force Install After"
                checked={machineAgent.enableForce}
                onChange={(checked) => updateMachineAgent({ enableForce: checked })}
              />

              {machineAgent.enableForce && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginLeft: '20px' }}>
                  <FormInput
                    label="X Days"
                    type="number"
                    value={machineAgent.forceDays.toString()}
                    onChange={(value) => updateMachineAgent({ forceDays: parseInt(value) || 0 })}
                  />
                  <FormInput
                    label="Time"
                    type="time"
                    value={machineAgent.forceTime}
                    onChange={(value) => updateMachineAgent({ forceTime: value })}
                  />
                </div>
              )}

              <Toggle
                label="Enable Retry"
                checked={machineAgent.retryEnabled}
                onChange={(checked) => updateMachineAgent({ retryEnabled: checked })}
              />

              {machineAgent.retryEnabled && (
                <div style={{ marginLeft: '20px' }}>
                  <FormInput
                    label="Max Attempts"
                    type="number"
                    value={machineAgent.retryMax.toString()}
                    onChange={(value) => updateMachineAgent({ retryMax: parseInt(value) || 3 })}
                  />
                </div>
              )}

              <RadioGroup
                label="Perform Pre Reboot if Required"
                name="preReboot"
                options={[
                  { id: 'yes', name: 'Yes' },
                  { id: 'no', name: 'No' }
                ]}
                value={machineAgent.preReboot.toLowerCase()}
                onChange={(value) => updateMachineAgent({ preReboot: value === 'yes' ? 'Yes' : 'No' })}
              />

              <RadioGroup
                label="Perform Post Reboot if Required"
                name="postReboot"
                options={[
                  { id: 'yes', name: 'Yes' },
                  { id: 'no', name: 'No' }
                ]}
                value={machineAgent.postReboot.toLowerCase()}
                onChange={(value) => updateMachineAgent({ postReboot: value === 'yes' ? 'Yes' : 'No' })}
              />

              <RadioGroup
                label="Show Notification"
                name="notify"
                options={[
                  { id: 'yes', name: 'Yes' },
                  { id: 'no', name: 'No' }
                ]}
                value={machineAgent.notify.toLowerCase()}
                onChange={(value) => updateMachineAgent({ notify: value === 'yes' ? 'Yes' : 'No' })}
              />
            </div>

            <div className={styles.boxFootnote}>
              'Force Install After' anchor = when patch is available/approved. Manual deployments ignore Machine timing unless 'Respect Policy Windows' is enabled at deploy.
            </div>
          </div>

          <div className={styles.box}>
            <div className={styles.boxHeader}>
              <h3 className={styles.boxTitle}>OS Update & Upgrade Patches (via Apple DDM)</h3>
            </div>

            {!isMacOS && (
              <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px', marginBottom: '16px' }}>
                <p style={{ margin: 0, fontSize: '13px', color: '#EF4444' }}>
                  OS Update & Upgrade (DDM) is macOS-only.
                </p>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <FormInput
                label="Force Install After — X Days"
                type="number"
                value={machineDDM.ddmForceDays.toString()}
                onChange={(value) => updateMachineDDM({ ddmForceDays: parseInt(value) || 0 })}
                required
              />
              <FormInput
                label="Time"
                type="time"
                value={machineDDM.ddmForceTime}
                onChange={(value) => updateMachineDDM({ ddmForceTime: value })}
                required
              />
            </div>

            <div className={styles.boxFootnote}>
              DDM supports force window only; reboot/retry/notifications are OS-managed.
            </div>
          </div>
        </div>
      </div>

      <div className={`${styles.tabContent} ${activeTab === 'application' ? styles.active : ''}`}>
        <div className={`${styles.grid} ${styles.gridCols1}`}>
          <div className={styles.box}>
            <div className={styles.boxHeader}>
              <h3 className={styles.boxTitle}>General Patch Behaviour (via EC Agent)</h3>
              <button className={styles.addButton}>+ Add Application</button>
            </div>

            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Application</th>
                  <th>Force Install</th>
                  <th>Retry</th>
                  <th>Max Attempts</th>
                  <th>Pre Reboot</th>
                  <th>Post Reboot</th>
                  <th>Notification</th>
                  <th>Pre Scripts</th>
                  <th>Post Scripts</th>
                  <th className={styles.center} style={{ width: '100px' }}>Edit</th>
                </tr>
              </thead>
              <tbody>
                {currentData.appAgentRows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.app}</td>
                    <td>{row.force}</td>
                    <td>{row.retry}</td>
                    <td>{row.max}</td>
                    <td>{row.pre}</td>
                    <td>{row.post}</td>
                    <td>{row.notif}</td>
                    <td>{row.preScript}</td>
                    <td>{row.postScript}</td>
                    <td className={styles.center}>
                      <a href="#" className={styles.editLink} onClick={(e) => e.preventDefault()}>
                        [Edit]
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className={styles.boxGuidance}>
              <div className={styles.guidanceItem}>• 'Inherit' resolves via Application ⟶ Machine.</div>
              <div className={styles.guidanceItem}>• Pre/Post Scripts: script name + args; args optional.</div>
            </div>
          </div>

          {isMacOS && (
            <div className={styles.box}>
              <div className={styles.boxHeader}>
                <h3 className={styles.boxTitle}>OS Update & Upgrade Patches (via Apple DDM)</h3>
                <button className={`${styles.addButton} ${styles.addButtonSecondary}`}>+ Add OS Application</button>
              </div>

              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Application</th>
                    <th>Force Install</th>
                    <th className={styles.center} style={{ width: '100px' }}>Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.appDDMRows.map((row) => (
                    <tr key={row.id}>
                      <td>{row.channel}</td>
                      <td>{row.force}</td>
                      <td className={styles.center}>
                        <a href="#" className={styles.editLink} onClick={(e) => e.preventDefault()}>
                          [Edit]
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className={styles.boxGuidance}>
                <div className={styles.guidanceItem}>• Represents OS Upgrade/Update applications, not typical apps.</div>
                <div className={styles.guidanceItem}>• Only Force Install window is configurable.</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={`${styles.footer} ${isDirty ? '' : styles.hidden}`}>
        <button className={styles.discardButton} onClick={handleDiscard}>
          Discard
        </button>
        <button className={styles.saveButton} onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  )
}

export default PolicyDetail
