import PlaceholderCard from '../components/PlaceholderCard'
import styles from './Page.module.css'

function AutonomousDeployment() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Deployment — Autonomous</h1>
        <p className={styles.subtitle}>Engine-driven rollouts based on policies and rings.</p>
      </div>
      <PlaceholderCard
        title="No autonomous flows configured"
        primaryButtonText="Create Autonomous Flow"
        secondaryLinkText="View docs"
        onPrimaryClick={() => console.log('Create autonomous flow')}
        onSecondaryClick={() => console.log('View docs')}
      />
    </div>
  )
}

export default AutonomousDeployment
