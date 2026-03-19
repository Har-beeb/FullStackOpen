import { useState, useImperativeHandle } from 'react'
import { Button, Box } from '@mui/material'

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(props.ref, () => {
    return { toggleVisibility }
  })

  return (
    <Box sx={{ mb: 2 }}>
      
      {/* 1. The main toggle button ("create new blog") */}
      <Box
        sx={{
          display: visible ? 'none' : 'flex',
          justifyContent: 'center', // Centers the button horizontally
          width: '100%',
        }}
      >
        <Button variant="contained" color="primary" onClick={toggleVisibility}>
          {props.buttonLabel}
        </Button>
      </Box>

      {/* 2. The form and the cancel button */}
      <Box
        sx={{
          display: visible ? 'flex' : 'none',
          flexDirection: 'column',
          width: '100%',
          maxWidth: 400, // Constrains the form width so it doesn't look stretched
          margin: '0 auto', // Centers the form block on the screen
        }}
      >
        {props.children}

        <Button
          variant="outlined"
          color="secondary"
          onClick={toggleVisibility}
          sx={{
            mt: 1,
            alignSelf: 'center',
          }}
        >
          cancel
        </Button>
      </Box>
      
    </Box>
  )
  //   </div>
  //   <div style={showWhenVisible}>
  //     {props.children}
  //     <button onClick={toggleVisibility}>cancel</button>
  //   </div> */}
  // </div>
}

export default Togglable
