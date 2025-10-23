import PlaceholderCard from '../components/PlaceholderCard'
import styles from './Page.module.css'

function ManualDeployment() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Deployment — Manual</h1>
        <p className={styles.subtitle}>Trigger and manage deployments manually.</p>
      </div>
      <PlaceholderCard
        title="No manual deployments yet"
        primaryButtonText="Create Manual Deployment"
        secondaryLinkText="Learn more"
        onPrimaryClick={() => console.log('Create manual deployment')}
        onSecondaryClick={() => console.log('Learn more')}
      />
    </div>
  )
}

export default ManualDeployment
