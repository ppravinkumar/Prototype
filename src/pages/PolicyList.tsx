import { useNavigate } from 'react-router-dom'
import styles from './PolicyList.module.css'

interface CustomGroup {
  id: string
  sno: number
  name: string
  count: number
  notes: string
}

const CUSTOM_GROUPS: CustomGroup[] = [
  { id: 'cg_001', sno: 1, name: 'macOS Workstations', count: 300, notes: 'Laptops + desktops' },
  { id: 'cg_002', sno: 2, name: 'macOS Leads – Do Not Disturb', count: 25, notes: 'Exempt from forced reboot' },
  { id: 'cg_003', sno: 3, name: 'Windows Servers', count: 120, notes: 'Dedicated server policies' },
  { id: 'cg_004', sno: 4, name: 'Windows Workstations', count: 540, notes: 'End-user endpoints' },
  { id: 'cg_005', sno: 5, name: 'Default Group', count: 47, notes: 'Catch-all for unassigned devices' }
]

function PolicyList() {
  const navigate = useNavigate()

  const handleEditClick = (id: string) => {
    navigate(`/policy/${id}`)
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Policy</h1>
      </div>

      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.center} style={{ width: '64px' }}>SNo</th>
              <th>Custom Group</th>
              <th className={styles.right} style={{ width: '160px' }}>Machine Count</th>
              <th>Notes</th>
              <th className={styles.center} style={{ width: '100px' }}>Edit</th>
            </tr>
          </thead>
          <tbody>
            {CUSTOM_GROUPS.map((group) => (
              <tr key={group.id}>
                <td className={`${styles.center} ${styles.snoCell}`}>{group.sno}</td>
                <td className={styles.cgName}>{group.name}</td>
                <td className={styles.right}>{group.count}</td>
                <td>{group.notes}</td>
                <td className={styles.center}>
                  <a
                    href="#"
                    className={styles.editLink}
                    onClick={(e) => {
                      e.preventDefault()
                      handleEditClick(group.id)
                    }}
                  >
                    [Edit]
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PolicyList
