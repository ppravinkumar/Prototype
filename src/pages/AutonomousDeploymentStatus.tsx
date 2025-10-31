import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import ProgressBar from '../components/ProgressBar'
import styles from './AutonomousDeploymentStatus.module.css'

interface ProgressBreakdown {
  yetToApply: number
  inProgress: number
  installed: number
  failed: number
}

interface PatchProgressBreakdown {
  yetToApply: number
  inProgress: number
  installed: number
  failed: number
}

interface Ring {
  ringName: string
  status: string
  autonomousStatus: string | null
  targets: number
  progressBreakdown: ProgressBreakdown
  installedPct: number
  patches: number
  patchProgressBreakdown: PatchProgressBreakdown
  patchInstalledPct: number
  startTime: string | null
  endTime: string | null
  hint: string
}

interface Group {
  groupId: string
  start: string
  end: string
  status: string
  autonomousStatus: string | null
  targets: number
  progressBreakdown: ProgressBreakdown
  installedPct: number
  patches: number
  patchProgressBreakdown: PatchProgressBreakdown
  patchInstalledPct: number
  rings: Ring[]
}

interface StatusData {
  id: string
  name: string
  overallStatus: string
  autonomousStatus: string | null
  installedPct: number
  latestGroup: { start: string; end: string }
  counts: ProgressBreakdown
  groups: Group[]
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
  const { id } = useParams<{ id: string }>()
  const [expandedGroups, setExpandedGroups] = useState<string[]>([])
  const [data, setData] = useState<StatusData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      fetchDeploymentStatus(id)
    }
  }, [id])

  const fetchDeploymentStatus = async (deploymentId: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data: deployment, error: depError } = await supabase
        .from('autonomous_deployments')
        .select('*')
        .eq('id', deploymentId)
        .maybeSingle()

      if (depError) throw depError
      if (!deployment) throw new Error('Deployment not found')

      const { data: groups, error: groupsError } = await supabase
        .from('autonomous_deployment_groups')
        .select('*')
        .eq('deployment_id', deploymentId)
        .order('start_date', { ascending: false })

      if (groupsError) throw groupsError

      const groupIds = (groups || []).map(g => g.id)
      const { data: rings, error: ringsError } = await supabase
        .from('autonomous_deployment_group_rings')
        .select('*')
        .in('group_id', groupIds)

      if (ringsError) throw ringsError

      const ringsByGroup = (rings || []).reduce((acc: Record<string, any[]>, ring: any) => {
        if (!acc[ring.group_id]) acc[ring.group_id] = []
        acc[ring.group_id].push(ring)
        return acc
      }, {} as Record<string, any[]>)

      const latestGroup = groups && groups.length > 0 ? groups[0] : null
      const overallCounts = (groups || []).reduce((acc: any, g: any) => ({
        yetToApply: acc.yetToApply + g.yet_to_apply,
        inProgress: acc.inProgress + g.in_progress,
        installed: acc.installed + g.installed,
        failed: acc.failed + g.failed
      }), { yetToApply: 0, inProgress: 0, installed: 0, failed: 0 })

      const formattedGroups: Group[] = (groups || []).map((g: any) => {
        const patches = Array.isArray(g.patches) ? g.patches : []
        return {
          groupId: g.group_id,
          start: g.start_date,
          end: g.end_date,
          status: g.status,
          autonomousStatus: g.autonomous_status || null,
          targets: g.targets,
          progressBreakdown: {
            yetToApply: g.yet_to_apply,
            inProgress: g.in_progress,
            installed: g.installed,
            failed: g.failed
          },
          installedPct: g.installed_pct,
          patches: patches.length,
          patchProgressBreakdown: {
            yetToApply: g.patch_yet_to_apply || 0,
            inProgress: g.patch_in_progress || 0,
            installed: g.patch_installed || 0,
            failed: g.patch_failed || 0
          },
          patchInstalledPct: g.patch_installed_pct || 0,
          rings: (ringsByGroup[g.id] || []).map((r: any) => {
            const ringPatches = Array.isArray(r.patches) ? r.patches : []
            return {
              ringName: r.ring_name,
              status: r.status,
              autonomousStatus: r.autonomous_status || null,
              targets: r.targets,
              progressBreakdown: {
                yetToApply: r.yet_to_apply,
                inProgress: r.in_progress,
                installed: r.installed,
                failed: r.failed
              },
              installedPct: r.installed_pct,
              patches: ringPatches.length,
              patchProgressBreakdown: {
                yetToApply: r.patch_yet_to_apply || 0,
                inProgress: r.patch_in_progress || 0,
                installed: r.patch_installed || 0,
                failed: r.patch_failed || 0
              },
              patchInstalledPct: r.patch_installed_pct || 0,
              startTime: r.start_time,
              endTime: r.end_time,
              hint: r.hint
            }
          })
        }
      })

      setData({
        id: deployment.id,
        name: deployment.deployment_name,
        overallStatus: deployment.overall_status,
        autonomousStatus: deployment.autonomous_status || null,
        installedPct: deployment.installed_pct,
        latestGroup: latestGroup ? {
          start: latestGroup.start_date,
          end: latestGroup.end_date
        } : { start: '', end: '' },
        counts: overallCounts,
        groups: formattedGroups
      })
    } catch (err) {
      console.error('Error fetching deployment status:', err)
      setError('Failed to load deployment status')
    } finally {
      setLoading(false)
    }
  }

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    )
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
          Loading deployment status...
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className={styles.page}>
        <div style={{ padding: '40px', textAlign: 'center', color: '#EF4444' }}>
          {error || 'Deployment not found'}
        </div>
      </div>
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
            <div className={styles.summaryLabel}>Latest Rollout</div>
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
          <h2 className={styles.tableTitle}>Rollouts</h2>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: '280px' }}>ROLLOUT (START → END)</th>
              <th style={{ width: '140px' }}>STATUS</th>
              <th style={{ width: '90px' }}>TARGETS</th>
              <th style={{ width: '200px' }}>TARGET PROGRESS</th>
              <th style={{ width: '90px' }}>PATCHES</th>
              <th style={{ width: '200px' }}>PATCH PROGRESS</th>
              <th style={{ width: '100px' }}>INSTALLED %</th>
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
                    <td><StatusBadge status={group.autonomousStatus || group.status} /></td>
                    <td>{group.targets}</td>
                    <td><ProgressBar breakdown={group.progressBreakdown} showLabels /></td>
                    <td>{group.patches}</td>
                    <td><ProgressBar breakdown={group.patchProgressBreakdown} showLabels /></td>
                    <td>{group.installedPct}%</td>
                    <td>
                      <span className={`${styles.chevron} ${isExpanded ? styles.chevronExpanded : ''}`}>
                        ›
                      </span>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className={styles.expandedRow}>
                      <td colSpan={8}>
                        <div className={styles.expandedContent}>
                          <table className={styles.innerTable}>
                            <thead>
                              <tr>
                                <th style={{ width: '140px' }}>RING</th>
                                <th style={{ width: '110px' }}>STATUS</th>
                                <th style={{ width: '80px' }}>TARGETS</th>
                                <th style={{ width: '160px' }}>TARGET PROGRESS</th>
                                <th style={{ width: '70px' }}>PATCHES</th>
                                <th style={{ width: '160px' }}>PATCH PROGRESS</th>
                                <th style={{ width: '90px' }}>INSTALLED %</th>
                                <th style={{ width: '140px' }}>START TIME</th>
                                <th style={{ width: '140px' }}>END TIME</th>
                                <th style={{ width: '180px' }}>HINT</th>
                              </tr>
                            </thead>
                            <tbody>
                              {group.rings.map((ring, idx) => (
                                <tr key={idx}>
                                  <td>{ring.ringName}</td>
                                  <td><StatusBadge status={ring.autonomousStatus || ring.status} /></td>
                                  <td>{ring.targets}</td>
                                  <td><ProgressBar breakdown={ring.progressBreakdown} small showLabels /></td>
                                  <td>{ring.patches}</td>
                                  <td><ProgressBar breakdown={ring.patchProgressBreakdown} small showLabels /></td>
                                  <td>{ring.installedPct}%</td>
                                  <td>{ring.startTime ? formatDateTime(ring.startTime) : '-'}</td>
                                  <td>{ring.endTime ? formatDateTime(ring.endTime) : '-'}</td>
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
