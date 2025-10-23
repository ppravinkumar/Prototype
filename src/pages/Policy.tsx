import PlaceholderCard from '../components/PlaceholderCard'
import styles from './Page.module.css'

function Policy() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Policy</h1>
        <p className={styles.subtitle}>Define behavior; does not trigger deployments.</p>
      </div>
      <PlaceholderCard
        title="No policies configured"
        primaryButtonText="Create Policy"
        secondaryLinkText="Documentation"
        onPrimaryClick={() => console.log('Create policy')}
        onSecondaryClick={() => console.log('Documentation')}
      />
    </div>
  )
}

export default Policy
