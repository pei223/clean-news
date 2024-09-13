import React, { useContext, useEffect, useState } from "react";
import { AppBar, Button, Container, Toolbar, Typography } from "@mui/material";
// import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App";

interface menu {
  icon?: () => React.ReactNode;
  link: string;
  text: string;
}

const menuList: menu[] = [
  {
    link: "/",
    text: "記事一覧",
  },
];

type Props = {
  children?: React.ReactNode;
};

function Layout({ children }: Props) {
  const navigate = useNavigate();
  const [appBarClickCount, setAppBarClickCount] = useState(0);
  const { developperMode, setDevelopperMode } = useContext(AppContext);

  // この辺は開発者モード切り替え用の処理
  const onClickAppBar = () => {
    console.log(appBarClickCount + 1);
    if (appBarClickCount + 1 > 5) {
      setDevelopperMode(true);
    }
    setAppBarClickCount(appBarClickCount + 1);
  };
  useEffect(() => {
    const id = setInterval(() => {
      console.log(0);
      setAppBarClickCount(0);
    }, 3000);
    return () => clearInterval(id);
  }, [setAppBarClickCount]);

  return (
    <>
      <AppBar>
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
          onClick={onClickAppBar}
        >
          <Typography
            variant="h6"
            marginLeft="20px"
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Clean news
            {developperMode && (
              <span style={{ fontWeight: "bold", marginLeft: "10px" }}>
                (dev mode)
              </span>
            )}
          </Typography>

          {menuList.map((menu) => (
            <Button
              key={menu.link}
              color="inherit"
              onClick={() => navigate(menu.link)}
            >
              <Typography>{menu.text}</Typography>
            </Button>
          ))}
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Container sx={{ paddingTop: 2 }}>{children}</Container>
    </>
  );
}

export default Layout;
