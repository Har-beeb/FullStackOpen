import { useSelector, useDispatch } from 'react-redux'
import { logoutUser } from '../reducers/userReducer'

const UserStatus = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)

  if (!user) {
    return null
  }

  return (
    <p>
      {user.name} logged in{' '}
      <button onClick={() => dispatch(logoutUser())}>logout</button>
    </p>
  )
}

export default UserStatus
