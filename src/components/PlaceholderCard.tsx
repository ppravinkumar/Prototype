import styles from './PlaceholderCard.module.css'

interface PlaceholderCardProps {
  title: string
  primaryButtonText: string
  secondaryLinkText: string
  onPrimaryClick?: () => void
  onSecondaryClick?: () => void
}

function PlaceholderCard({
  title,
  primaryButtonText,
  secondaryLinkText,
  onPrimaryClick,
  onSecondaryClick
}: PlaceholderCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.actions}>
          <button className={styles.primaryButton} onClick={onPrimaryClick}>
            {primaryButtonText}
          </button>
          <button className={styles.secondaryLink} onClick={onSecondaryClick}>
            {secondaryLinkText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PlaceholderCard
