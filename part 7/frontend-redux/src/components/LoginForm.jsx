import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import { loginUser } from '../reducers/userReducer'
import Togglable from './Togglable'

const LoginForm = () => {
  const dispatch = useDispatch()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (event) => {
    event.preventDefault()

    const loginDetails = { username, password }

    try {
      dispatch(loginUser(loginDetails))
      setUsername('')
      setPassword('')
      dispatch(setNotification('Login Successful', 'success'))
    } catch {
      dispatch(setNotification('Wrong credentials', 'error'))
    }

    // createLogin({
    //   username,
    //   password,
    // })
  }

  return (
    <Togglable buttonLabel="login">
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </Togglable>
  )
}

export default LoginForm
