import { useNavigate } from 'react-router-dom'
import styles from './AutonomousDeploymentList.module.css'

interface Deployment {
  id: string
  name: string
  progressPct: number
  createdBy: string
}

const SAMPLE_DEPLOYMENTS: Deployment[] = [
  { id: "dep_001", name: "macOS All Applications", progressPct: 72, createdBy: "Mac Admin" },
  { id: "dep_002", name: "Linux All Application Except Server Application", progressPct: 35, createdBy: "Admin" },
  { id: "dep_003", name: "Windows OS Applications", progressPct: 5, createdBy: "Admin" },
  { id: "dep_004", name: "Windows All Applications Excepet SQL Server", progressPct: 100, createdBy: "Admin" }
]

function AutonomousDeploymentList() {
  const navigate = useNavigate()

  const handleCreateDeployment = () => {
    navigate('/deployment/autonomous/create')
  }

  const handleDeploymentClick = (id: string) => {
    navigate(`/deployment/autonomous/${id}`)
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
          {SAMPLE_DEPLOYMENTS.map((deployment) => (
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
