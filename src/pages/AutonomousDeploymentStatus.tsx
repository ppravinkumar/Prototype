import { useState } from 'react'
import styles from './AutonomousDeploymentStatus.module.css'

interface ProgressBreakdown {
  yetToApply: number
  inProgress: number
  installed: number
  failed: number
}

interface Ring {
  ringName: string
  status: string
  targets: number
  progressBreakdown: ProgressBreakdown
  installedPct: number
  hint: string
}

interface Group {
  groupId: string
  start: string
  end: string
  status: string
  targets: number
  progressBreakdown: ProgressBreakdown
  installedPct: number
  rings: Ring[]
}

interface StatusData {
  id: string
  name: string
  overallStatus: string
  installedPct: number
  latestGroup: { start: string; end: string }
  counts: ProgressBreakdown
  groups: Group[]
}

const SAMPLE_STATUS_DATA: StatusData = {
  id: "dep_002",
  name: "Monthly App Patch",
  overallStatus: "Yet to apply",
  installedPct: 0,
  latestGroup: { start: "2025-11-12T19:00:00Z", end: "2025-12-11T18:59:00Z" },
  counts: { yetToApply: 300, inProgress: 0, installed: 0, failed: 0 },
  groups: [
    {
      groupId: "g1",
      start: "2025-11-12T19:00:00Z",
      end: "2025-12-11T18:59:00Z",
      status: "Yet to apply",
      targets: 300,
      progressBreakdown: { yetToApply: 300, inProgress: 0, installed: 0, failed: 0 },
      installedPct: 0,
      rings: [
        { ringName: "Internal users", status: "Yet to apply", targets: 100, progressBreakdown: { yetToApply: 100, inProgress: 0, installed: 0, failed: 0 }, installedPct: 0, hint: "Waiting for boundary" },
        { ringName: "Early adopters", status: "Yet to apply", targets: 120, progressBreakdown: { yetToApply: 120, inProgress: 0, installed: 0, failed: 0 }, installedPct: 0, hint: "Waiting for Internal users ≥ 60%" },
        { ringName: "All Users", status: "Yet to apply", targets: 80, progressBreakdown: { yetToApply: 80, inProgress: 0, installed: 0, failed: 0 }, installedPct: 0, hint: "Waiting for Early adopters ≥ 80%" }
      ]
    },
    {
      groupId: "g0",
      start: "2025-10-16T20:00:00Z",
      end: "2025-11-12T18:59:00Z",
      status: "In Progress",
      targets: 300,
      progressBreakdown: { yetToApply: 240, inProgress: 45, installed: 10, failed: 5 },
      installedPct: 13,
      rings: [
        { ringName: "Internal users", status: "In Progress", targets: 100, progressBreakdown: { yetToApply: 30, inProgress: 8, installed: 62, failed: 0 }, installedPct: 62, hint: "" },
        { ringName: "Early adopters", status: "Yet to apply", targets: 120, progressBreakdown: { yetToApply: 120, inProgress: 0, installed: 0, failed: 0 }, installedPct: 0, hint: "Waiting for Internal users ≥ 60%" },
        { ringName: "All Users", status: "Yet to apply", targets: 80, progressBreakdown: { yetToApply: 80, inProgress: 0, installed: 0, failed: 0 }, installedPct: 0, hint: "Waiting for Early adopters ≥ 80%" }
      ]
    },
    {
      groupId: "g-1",
      start: "2025-09-12T19:00:00Z",
      end: "2025-10-16T19:59:00Z",
      status: "Installed",
      targets: 292,
      progressBreakdown: { yetToApply: 0, inProgress: 0, installed: 292, failed: 0 },
      installedPct: 100,
      rings: [
        { ringName: "Internal users", status: "Installed", targets: 100, progressBreakdown: { yetToApply: 0, inProgress: 0, installed: 100, failed: 0 }, installedPct: 100, hint: "" },
        { ringName: "Early adopters", status: "Installed", targets: 120, progressBreakdown: { yetToApply: 0, inProgress: 0, installed: 120, failed: 0 }, installedPct: 100, hint: "" },
        { ringName: "All Users", status: "Installed", targets: 72, progressBreakdown: { yetToApply: 0, inProgress: 0, installed: 72, failed: 0 }, installedPct: 100, hint: "" }
      ]
    }
  ]
}

function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
}

function ProgressComposite({ breakdown, small = false }: { breakdown: ProgressBreakdown; small?: boolean }) {
  const total = breakdown.yetToApply + breakdown.inProgress + breakdown.installed + breakdown.failed

  if (total === 0) return <div className={small ? styles.progressCompositeSmall : styles.progressComposite} />

  const yetToApplyPct = (breakdown.yetToApply / total) * 100
  const inProgressPct = (breakdown.inProgress / total) * 100
  const installedPct = (breakdown.installed / total) * 100
  const failedPct = (breakdown.failed / total) * 100

  return (
    <div className={small ? styles.progressCompositeSmall : styles.progressComposite}>
      {yetToApplyPct > 0 && (
        <div
          className={styles.progressSegment}
          style={{ width: `${yetToApplyPct}%`, backgroundColor: '#6B7280' }}
        />
      )}
      {inProgressPct > 0 && (
        <div
          className={styles.progressSegment}
          style={{ width: `${inProgressPct}%`, backgroundColor: '#3B82F6' }}
        />
      )}
      {installedPct > 0 && (
        <div
          className={styles.progressSegment}
          style={{ width: `${installedPct}%`, backgroundColor: '#22C55E' }}
        />
      )}
      {failedPct > 0 && (
        <div
          className={styles.progressSegment}
          style={{ width: `${failedPct}%`, backgroundColor: '#EF4444' }}
        />
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const getStatusClass = () => {
    switch (status) {
      case 'Yet to apply':
        return styles.statusYetToApply
      case 'In Progress':
        return styles.statusInProgress
      case 'Installed':
        return styles.statusInstalled
      case 'Failed':
        return styles.statusFailed
      default:
        return styles.statusYetToApply
    }
  }

  return <span className={`${styles.statusBadge} ${getStatusClass()}`}>{status}</span>
}

function AutonomousDeploymentStatus() {
  const [expandedGroups, setExpandedGroups] = useState<string[]>([])

  const data = SAMPLE_STATUS_DATA

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          Deployment Status — {data.name}
          <span className={styles.badge}>{data.overallStatus}</span>
        </h1>
      </div>

      <div className={styles.summaryCard}>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryBlock}>
            <div className={styles.summaryLabel}>Latest Group</div>
            <div className={styles.summaryValue}>
              {formatDateTime(data.latestGroup.start)} → {formatDateTime(data.latestGroup.end)}
            </div>
          </div>

          <div className={styles.summaryBlock}>
            <div className={styles.summaryLabel}>Installed</div>
            <div className={styles.summaryValueLarge}>{data.installedPct}%</div>
          </div>

          <div className={styles.summaryBlock}>
            <div className={styles.metricsInline}>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Yet to apply</div>
                <div className={styles.metricValue}>{data.counts.yetToApply}</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>In Progress</div>
                <div className={styles.metricValue}>{data.counts.inProgress}</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Installed</div>
                <div className={styles.metricValue}>{data.counts.installed}</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Failed</div>
                <div className={styles.metricValue}>{data.counts.failed}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h2 className={styles.tableTitle}>Groups</h2>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: '320px' }}>GROUP (START → END)</th>
              <th style={{ width: '160px' }}>STATUS</th>
              <th style={{ width: '110px' }}>TARGETS</th>
              <th style={{ width: '260px' }}>PROGRESS</th>
              <th style={{ width: '120px' }}>INSTALLED %</th>
              <th style={{ width: '60px' }}>RINGS</th>
            </tr>
          </thead>
          <tbody>
            {data.groups.map((group) => {
              const isExpanded = expandedGroups.includes(group.groupId)
              return (
                <>
                  <tr key={group.groupId} onClick={() => toggleGroup(group.groupId)}>
                    <td>{formatDateTime(group.start)} → {formatDateTime(group.end)}</td>
                    <td><StatusBadge status={group.status} /></td>
                    <td>{group.targets}</td>
                    <td><ProgressComposite breakdown={group.progressBreakdown} /></td>
                    <td>{group.installedPct}%</td>
                    <td>
                      <span className={`${styles.chevron} ${isExpanded ? styles.chevronExpanded : ''}`}>
                        ›
                      </span>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className={styles.expandedRow}>
                      <td colSpan={6}>
                        <div className={styles.expandedContent}>
                          <table className={styles.innerTable}>
                            <thead>
                              <tr>
                                <th style={{ width: '180px' }}>RING</th>
                                <th style={{ width: '140px' }}>STATUS</th>
                                <th style={{ width: '110px' }}>TARGETS</th>
                                <th style={{ width: '240px' }}>PROGRESS</th>
                                <th style={{ width: '120px' }}>INSTALLED %</th>
                                <th style={{ width: '260px' }}>HINT</th>
                              </tr>
                            </thead>
                            <tbody>
                              {group.rings.map((ring, idx) => (
                                <tr key={idx}>
                                  <td>{ring.ringName}</td>
                                  <td><StatusBadge status={ring.status} /></td>
                                  <td>{ring.targets}</td>
                                  <td><ProgressComposite breakdown={ring.progressBreakdown} small /></td>
                                  <td>{ring.installedPct}%</td>
                                  <td><span className={styles.hintText}>{ring.hint}</span></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AutonomousDeploymentStatus
