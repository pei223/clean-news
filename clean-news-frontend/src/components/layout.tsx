import React, { useCallback, useContext, useEffect, useState } from 'react'
import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { AppContext } from '../stores/appContext'

interface menu {
  icon?: () => React.ReactNode
  link: string
  text: string
}

const menuList: menu[] = [
  {
    link: '/',
    text: '記事一覧',
  },
]

type Props = {
  children?: React.ReactNode
}

function Layout({ children }: Props) {
  const navigate = useNavigate()
  const [appBarClickCount, setAppBarClickCount] = useState(0)
  const { developperMode, setDevelopperMode } = useContext(AppContext)

  const onLogout = useCallback(async () => {
    await signOut(auth)
    navigate('/login')
  }, [navigate])

  // この辺は開発者モード切り替え用の処理
  const onClickAppBar = () => {
    console.log(appBarClickCount + 1)
    if (appBarClickCount + 1 > 5) {
      setDevelopperMode(true)
    }
    setAppBarClickCount(appBarClickCount + 1)
  }
  useEffect(() => {
    const id = setInterval(() => {
      console.log(0)
      setAppBarClickCount(0)
    }, 3000)
    return () => clearInterval(id)
  }, [setAppBarClickCount])

  return (
    <>
      <AppBar>
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          onClick={onClickAppBar}
        >
          <Typography
            variant="h6"
            marginLeft="20px"
            sx={{ cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            Clean news
            {developperMode && (
              <span style={{ fontWeight: 'bold', marginLeft: '10px' }}>(dev mode)</span>
            )}
          </Typography>

          <Box>
            {menuList.map((menu) => (
              <Button
                key={menu.link}
                color="inherit"
                onClick={() => navigate(menu.link)}
                sx={{
                  marginRight: 2,
                }}
              >
                <Typography>{menu.text}</Typography>
              </Button>
            ))}
            <Button color="inherit" onClick={onLogout}>
              <Typography>logout</Typography>
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Container sx={{ paddingTop: 2 }}>{children}</Container>
    </>
  )
}

export default Layout
