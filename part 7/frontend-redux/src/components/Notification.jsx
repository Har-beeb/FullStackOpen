import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector((state) => state.notification)

  if (!notification) {
    return null
  }

  const style = {
    color: notification.type === 'error' ? 'red' : 'green',
    border: `2px solid ${notification.type === 'error' ? 'red' : 'green'}`,
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    backgroundColor: '#f8f9fa',
  }

  return <div style={style}>{notification.message}</div>
}

export default Notification
