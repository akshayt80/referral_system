import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LogIn from './components/login';
import SignUp from './components/signup';
import Pricing from './components/subscriptions';
import { AppBar, CssBaseline, GlobalStyles, Toolbar, Button } from '@mui/material';
import Home, { PaymentRedirect } from './components/home';

function Default() {
  return (
    <>
      <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
      <CssBaseline />
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
      >
        <Toolbar sx={{ flexWrap: 'wrap' }}>
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            Referral system
          </Typography>
          <Button href="/login" variant="outlined" sx={{ my: 1, mx: 1.5 }}>
            Login
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Referral System made on React with Typescript
          </Typography>
        </Box>
      </Container>
    </>
  );
}

export default function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Default />} />
        <Route path="login" element={<LogIn />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="subscription" element={<Pricing />} />
        <Route path="home" element={<Home />} />
        <Route path="payment" element={<PaymentRedirect />} />
      </Routes>
    </BrowserRouter>
  )
}
