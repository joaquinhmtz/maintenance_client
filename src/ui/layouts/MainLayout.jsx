import React, { useState, useEffect } from 'react';
import { Outlet } from "react-router-dom";

import {
  Box,
  useTheme,
  useMediaQuery,
} from '@mui/material';

import { C, APP_NAME, DRAWER_WIDTH, COLLAPSED_WIDTH } from "../../theme/variables";
import TopBar from './TopBar';
import Footer from './Footer';
import Sidebar from './Sidebar';

const Layout = () => {

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sideOpen, setSideOpen] = useState(false);
  const contentMargin = isMobile ? 0 : sideOpen ? DRAWER_WIDTH : COLLAPSED_WIDTH;

  const [anchorEl, setAnchorEl] = useState(null);
  const [selected, setSelected] = useState("dashboard");

  return (


    <Box sx={{ display: "flex", minHeight: "100vh", overflowX: "hidden" }}>

      {/* Sidebar */}
      <Sidebar
        open={sideOpen}
        isMobile={isMobile}
        onClose={() => setSideOpen(false)}
        selected={selected}
        onSelect={setSelected}
        theme={theme}
      />

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* ── NAVBAR ── */}
        <TopBar
          theme={theme}
          sideOpen={sideOpen}
          anchorEl={anchorEl}
          setSideOpen={setSideOpen}
          setAnchorEl={setAnchorEl}
          isMobile={isMobile}
        />

        {/* ── CONTENT ── */}
        <Box component="main"
          sx={{
            flex: 1,
            p: 3,
            mt: "64px",
            bgcolor: C.menta,
            minWidth: 0,
            overflowX: "hidden"
          }}
        >

          <Outlet />

        </Box>

        {/* ── FOOTER ── */}
        <Footer nameApp={APP_NAME} />

      </Box>
    </Box>
  );
};

export default Layout;
