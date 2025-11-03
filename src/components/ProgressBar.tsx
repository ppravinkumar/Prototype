import { useRef, useEffect, useState } from 'react'
import styles from './ProgressBar.module.css'

interface ProgressBreakdown {
  yetToApply: number
  inProgress: number
  installed: number
  failed: number
}

interface ProgressBarProps {
  breakdown: ProgressBreakdown
  small?: boolean
  showLabels?: boolean
}

interface SegmentData {
  count: number
  percentage: number
  color: string
  label: string
  key: keyof ProgressBreakdown
}

function ProgressBar({ breakdown, small = false, showLabels = false }: ProgressBarProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)

  useEffect(() => {
    if (!showLabels || !containerRef.current) return

    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
      }
    }

    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [showLabels])

  const total = breakdown.yetToApply + breakdown.inProgress + breakdown.installed + breakdown.failed

  if (total === 0) {
    return <div ref={containerRef} className={small ? styles.progressBarSmall : styles.progressBar} />
  }

  const segments: SegmentData[] = [
    {
      count: breakdown.installed,
      percentage: (breakdown.installed / total) * 100,
      color: '#22C55E',
      label: 'Installed',
      key: 'installed' as keyof ProgressBreakdown
    },
    {
      count: breakdown.failed,
      percentage: (breakdown.failed / total) * 100,
      color: '#EF4444',
      label: 'Failed',
      key: 'failed' as keyof ProgressBreakdown
    },
    {
      count: breakdown.yetToApply,
      percentage: (breakdown.yetToApply / total) * 100,
      color: '#F59E0B',
      label: 'Yet to Apply',
      key: 'yetToApply' as keyof ProgressBreakdown
    },
    {
      count: breakdown.inProgress,
      percentage: (breakdown.inProgress / total) * 100,
      color: '#3B82F6',
      label: 'In Progress',
      key: 'inProgress' as keyof ProgressBreakdown
    }
  ].filter(seg => seg.count > 0)

  const minWidthForLabel = small ? 30 : 40

  return (
    <div ref={containerRef} className={small ? styles.progressBarSmall : styles.progressBar}>
      {segments.map((segment) => {
        const segmentWidth = containerWidth * (segment.percentage / 100)
        const canShowLabel = showLabels && segmentWidth >= minWidthForLabel

        return (
          <div
            key={segment.key}
            className={styles.progressSegment}
            style={{
              width: `${segment.percentage}%`,
              backgroundColor: segment.color
            }}
            title={`${segment.label}: ${segment.count}`}
          >
            {canShowLabel && (
              <span
                className={small ? styles.segmentLabelSmall : styles.segmentLabel}
                style={{
                  color: segment.key === 'installed' ? '#062f12' : segment.key === 'yetToApply' ? '#1F2937' : '#FFFFFF'
                }}
              >
                {segment.count}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default ProgressBar
