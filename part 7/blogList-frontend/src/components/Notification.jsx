import NotificationContext from '../context/NotificationContext'
import { useContext } from 'react'
import { Snackbar, Alert, Fade } from '@mui/material'

const Notification = () => {
  const [notification] = useContext(NotificationContext)

  if (!notification) {
    return null
  }

  return (
    <Snackbar
      open={notification !== null}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      slots={{ transition: Fade }}
    >
      {notification ? (
        <Alert
          severity={notification.type === 'error' ? 'error' : 'success'}
          variant="filled"
          sx={{ width: '100%', marginTop: '60px' }}
        >
          {notification.message}
        </Alert>
      ) : (
        <div />
      )}
    </Snackbar>
  )
}

export default Notification
