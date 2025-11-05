import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import styles from './AutonomousDeploymentList.module.css'

interface Deployment {
  id: string
  name: string
  progressPct: number
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
        .select('id, deployment_name, installed_pct, created_by')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError

      const formattedDeployments = (data || []).map(d => ({
        id: d.id,
        name: d.deployment_name,
        progressPct: d.installed_pct,
        createdBy: d.created_by
      }))

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
            <th>Status</th>
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
                <div className={styles.progressContainer}>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${deployment.progressPct}%` }}
                    />
                  </div>
                  <span className={styles.progressLabel}>{deployment.progressPct}%</span>
                </div>
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
