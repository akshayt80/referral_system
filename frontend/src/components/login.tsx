import React, { FormEvent, useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';

import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { post } from '../services.ts/api.service';
import { LoginRequests, LoginResponse } from '../interfaces/login.interfaces';
import { setUserToken } from '../services.ts/token.service';
import { useNavigate } from 'react-router';
import { Alert } from '@mui/material';

const theme = createTheme();

export default function LogIn() {

    const navigate = useNavigate();
    const [error, setError] = useState<string>()
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data = new FormData(event.currentTarget);
        if (!data.get("email") || !data.get("password")) {
            return setError("Please enter both email and password")
        }

        const requestBody: LoginRequests = {
            email: data.get('email')!!.toString(),
            password: data.get('password')!!.toString()
        }
        await post("/user/login", requestBody)
            .then((data: LoginResponse) => setUserToken(data))
            .then(() => navigate("/home"))
            .catch((e: Response | Error) => {
                console.log({ e })
                if (e instanceof Response) {
                    if (e.status === 401) {
                        setError("Cannot verify the identity.")
                    } else {
                        setError(`Backend request failes with code: ${e.status}`)
                    }
                }

            })
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        {error ? <Alert severity='error'>{error}</Alert> : null}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link href="/signup" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
