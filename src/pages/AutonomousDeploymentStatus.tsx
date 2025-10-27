import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
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

      const formattedGroups: Group[] = (groups || []).map((g: any) => ({
        groupId: g.group_id,
        start: g.start_date,
        end: g.end_date,
        status: g.status,
        targets: g.targets,
        progressBreakdown: {
          yetToApply: g.yet_to_apply,
          inProgress: g.in_progress,
          installed: g.installed,
          failed: g.failed
        },
        installedPct: g.installed_pct,
        rings: (ringsByGroup[g.id] || []).map((r: any) => ({
          ringName: r.ring_name,
          status: r.status,
          targets: r.targets,
          progressBreakdown: {
            yetToApply: r.yet_to_apply,
            inProgress: r.in_progress,
            installed: r.installed,
            failed: r.failed
          },
          installedPct: r.installed_pct,
          hint: r.hint
        }))
      }))

      setData({
        id: deployment.id,
        name: deployment.deployment_name,
        overallStatus: deployment.overall_status,
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
