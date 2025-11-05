import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import ProgressBar from '../components/ProgressBar'
import styles from './AutonomousDeploymentList.module.css'

interface ProgressBreakdown {
  yetToApply: number
  inProgress: number
  installed: number
  failed: number
}

interface Deployment {
  id: string
  name: string
  progressBreakdown: ProgressBreakdown | null
  autonomousStatus: string | null
  createdBy: string
}

function AutonomousDeploymentList() {
  const navigate = useNavigate()
  const [deployments, setDeployments] = useState<Deployment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDeployments()
  }, [])

  const fetchDeployments = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('autonomous_deployments')
        .select('id, deployment_name, autonomous_status, created_by')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      const deploymentIds = (data || []).map(d => d.id)

      const { data: groups, error: groupsError } = await supabase
        .from('autonomous_deployment_groups')
        .select('deployment_id, yet_to_apply, in_progress, installed, failed, start_date')
        .in('deployment_id', deploymentIds)
        .order('start_date', { ascending: false })

      if (groupsError) throw groupsError

      const latestGroupByDeployment = (groups || []).reduce((acc: Record<string, any>, group: any) => {
        if (!acc[group.deployment_id]) {
          acc[group.deployment_id] = group
        }
        return acc
      }, {} as Record<string, any>)

      const formattedDeployments = (data || []).map(d => {
        const latestGroup = latestGroupByDeployment[d.id]
        return {
          id: d.id,
          name: d.deployment_name,
          progressBreakdown: latestGroup ? {
            yetToApply: latestGroup.yet_to_apply,
            inProgress: latestGroup.in_progress,
            installed: latestGroup.installed,
            failed: latestGroup.failed
          } : null,
          autonomousStatus: d.autonomous_status || null,
          createdBy: d.created_by
        }
      })

      setDeployments(formattedDeployments)
    } catch (err) {
      console.error('Error fetching deployments:', err)
      setError('Failed to load deployments')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateDeployment = () => {
    navigate('/deployment/autonomous/create')
  }

  const handleDeploymentClick = (id: string) => {
    navigate(`/deployment/autonomous/${id}`)
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Deployments</h1>
          </div>
        </div>
        <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
          Loading deployments...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Deployments</h1>
          </div>
        </div>
        <div style={{ padding: '40px', textAlign: 'center', color: '#EF4444' }}>
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Deployments</h1>
        </div>
        <button className={styles.createButton} onClick={handleCreateDeployment}>
          Create Deployment
        </button>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Deployment Name</th>
            <th>Last Rollout Target Progress</th>
            <th>Created By</th>
          </tr>
        </thead>
        <tbody>
          {deployments.map((deployment) => (
            <tr key={deployment.id}>
              <td>
                <a
                  href="#"
                  className={styles.nameLink}
                  onClick={(e) => {
                    e.preventDefault()
                    handleDeploymentClick(deployment.id)
                  }}
                >
                  {deployment.name}
                </a>
              </td>
              <td className={styles.progressCell}>
                {deployment.progressBreakdown ? (
                  <ProgressBar breakdown={deployment.progressBreakdown} showLabels />
                ) : (
                  <span className={styles.noData}>No rollout data</span>
                )}
              </td>
              <td>{deployment.createdBy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AutonomousDeploymentList
