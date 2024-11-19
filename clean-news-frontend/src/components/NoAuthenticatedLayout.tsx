import { AppBar, Toolbar, Typography, Container, Box, Button } from '@mui/material'
import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

type Props = {
  children?: ReactNode
}

function NoAuthenticatedLayout({ children }: Props) {
  const navigate = useNavigate()

  return (
    <>
      <AppBar>
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            variant="h6"
            marginLeft="20px"
            sx={{ cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            Clean news
          </Typography>
          <Box>
            <Button color="inherit" onClick={() => navigate('/login')}>
              <Typography>login</Typography>
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Container sx={{ paddingTop: 2 }}>{children}</Container>
    </>
  )
}

export default NoAuthenticatedLayout
