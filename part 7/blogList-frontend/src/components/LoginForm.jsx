import { useState } from 'react'
import Togglable from './Togglable'
import UserContext from '../context/UserContext'
import { useContext } from 'react'
import NotificationContext from '../context/NotificationContext'
import { TextField, Button, Box, Typography } from '@mui/material'

const LoginForm = () => {
  const [notification, notifyWith] = useContext(NotificationContext)
  const { loginUser } = useContext(UserContext)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()

    const loginDetails = { username, password }

    try {
      await loginUser(loginDetails)
      setUsername('')
      setPassword('')
      notifyWith('Login successful', 'success')
    } catch {
      notifyWith('Login failed', 'error')
    }
  }

  return (
    <Togglable buttonLabel="login">
      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          width: '100%',
          maxWidth: 300,
          margin: '0 auto',
          marginTop: 2,
        }}
      >
        <Typography variant="h5" component="h2" align="center" gutterBottom>
          Log in to application
        </Typography>

        <TextField
          label="username"
          variant="outlined"
          size="small"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />

        <TextField
          label="password"
          type="password"
          variant="outlined"
          size="small"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />

        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{ mt: 1 }}
        >
          Login
        </Button>
      </Box>
    </Togglable>
  )
}

export default LoginForm
