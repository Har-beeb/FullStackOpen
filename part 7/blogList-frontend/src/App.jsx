import { useEffect } from 'react'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import { useContext } from 'react'
import Notification from './components/Notification'
import UserContext from './context/UserContext'
import BlogList from './components/BlogList'
import Users from './components/Users'
import { Route, Routes } from 'react-router-dom'
import { Link } from 'react-router-dom'
import UserView from './components/UserView'
import BlogView from './components/BlogView'

import {
  Container,
  AppBar,
  Toolbar,
  Button,
  Typography,
  Paper,
  Box,
} from '@mui/material'

const Menu = () => {
  const { user, logoutUser } = useContext(UserContext)
  return (
    <AppBar position="static" sx={{ marginBottom: 3 }}>
      <Toolbar>
        <Button color="inherit" component={Link} to="/">
          Blogs
        </Button>
        <Button color="inherit" component={Link} to="/users">
          Users
        </Button>
        <Typography sx={{ flexGrow: 1 }}></Typography>
        {user ? (
          <>
            <Typography
              variant="button"
              sx={{ marginRight: 2, textTransform: 'none' }}
            >
              {user.name} logged in
            </Typography>
            <Button color="inherit" variant="outlined" onClick={logoutUser}>
              Logout
            </Button>
          </>
        ) : null}
      </Toolbar>
    </AppBar>
  )
}

const App = () => {
  const { user, initializeUser } = useContext(UserContext)

  useEffect(() => {
    initializeUser()
  }, [])

  return (
    <Container>
      <div>
        {!user && (
          <Box
            sx={{
              // minHeight="100vh" ensures the box takes up the full screen height
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center', // Vertically centers the content
              alignItems: 'center', // Horizontally centers the content
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h2"
              component="h1"
              color="primary"
              fontWeight="bold"
              gutterBottom
            >
              The Hax Spectrum
            </Typography>

            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              Discover, share, and discuss the best technical articles,
              development insights, and smart home engineering projects.
            </Typography>
            <Notification />
            <Paper
              elevation={4}
              sx={{ padding: 4, width: '100%', borderRadius: 3 }}
            >
              <Typography variant="h6" gutterBottom fontWeight="medium">
                Welcome Back
              </Typography>
              <LoginForm />
            </Paper>
          </Box>
        )}

        {user && (
          <div>
            <Menu />
            <Notification />
            <Routes>
              <Route
                path="/"
                element={
                  <div>
                    <BlogForm />
                    <BlogList />
                  </div>
                }
              />
              <Route path="/users" element={<Users />} />
              <Route path="/users/:id" element={<UserView />} />
              <Route path="/blogs/:id" element={<BlogView />} />
            </Routes>
          </div>
        )}
      </div>
    </Container>
  )
}

export default App
