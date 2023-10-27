import React from "react"
import { Card, CardHeader, CircularProgress, Container, createTheme, Grid, Link, Table, TableBody, TableCell, TableHead, TableRow, ThemeProvider, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { ReferralDetail, ReferralsResponse } from "../interfaces/referral.interfaces"
import { User } from "../interfaces/user.interfaces"
import { get } from "../services.ts/api.service"
import { frontendHost } from "../services.ts/config.service"

function Referrals({ referrals }: { referrals: ReferralDetail[] }) {
    return (
        <>
            {
                referrals.length == 0 ?
                    <Typography textAlign={"center"}>No paid referrals yet.</Typography> :
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>First Name</TableCell>
                                <TableCell>Last Name</TableCell>
                                <TableCell align="right">Referral Bonus</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {referrals.map((row, index) => (
                                <TableRow key={index}>
                                    <TableCell>{row.firstName}</TableCell>
                                    <TableCell>{row.lastName}</TableCell>
                                    <TableCell align="right">{`$${row.amountEarned}`}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
            }

        </>
    );
}

const mdTheme = createTheme();

export function Dashboard() {
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<User>()
    const [referrals, setReferrals] = useState<ReferralDetail[]>([])
    const [amountEarned, setAmountEarned] = useState<number>(0)

    useEffect(() => {
        Promise.all([get("/user", true)
            .then((data: User) => {
                setUser(data)
            }),
        get("/user/referrals", true)
            .then((data: ReferralsResponse) => {
                setReferrals(data.referrals)
                setAmountEarned(data.totalAmount)
            })
        ]).then(_ => setLoading(false))
    }, [])

    return (
        <>
            {loading && <CircularProgress />}
            {!loading && user && <ThemeProvider theme={mdTheme}>
                <Container disableGutters component="main" sx={{
                    pt: 8, pb: 6, backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                            ? theme.palette.grey[100]
                            : theme.palette.grey[900],
                }}>
                    <Typography variant="h5" align="center" color="text.secondary" component="p">
                        Hello, {user.firstName} {user.lastName}
                    </Typography>
                </Container>
                <Container maxWidth="md" component="main">
                    <Grid container spacing={5} alignItems="flex-end">
                        {/* <Toolbar /> */}
                        <Grid
                            item
                            key="link"
                            xs={12}
                            sm={12}
                            md={4}
                        >
                            <Card raised={true} sx={{
                                textAlign: "center"
                            }}>
                                <CardHeader
                                    title={"Refer Friends/Family"}
                                    titleTypographyProps={{ align: 'center' }}
                                    subheaderTypographyProps={{
                                        align: 'center',
                                    }}
                                    sx={{
                                        backgroundColor: (theme) =>
                                            theme.palette.mode === 'light'
                                                ? theme.palette.grey[200]
                                                : theme.palette.grey[700],
                                    }}
                                />
                                <Link href={`${frontendHost()}/signup?referral-code=${user.referralCode}`}>
                                    Referral Link
                                </Link>
                            </Card>
                        </Grid>
                        {/* Amount Earned */}
                        <Grid
                            item
                            key="amount"
                            xs={12}
                            sm={12}
                            md={4}
                        >
                            <Card raised={true} >
                                <CardHeader
                                    title={"Amount Earned"}
                                    titleTypographyProps={{ align: 'center' }}
                                    subheaderTypographyProps={{
                                        align: 'center',
                                    }}
                                    sx={{
                                        backgroundColor: (theme) =>
                                            theme.palette.mode === 'light'
                                                ? theme.palette.grey[200]
                                                : theme.palette.grey[700],
                                    }}
                                />
                                <Typography component="p" variant="h4" justifyContent={"center"} textAlign="center">
                                    ${amountEarned}
                                </Typography>
                            </Card>
                        </Grid>
                        {/* Referrals */}
                        <Grid
                            item
                            key="referrals"
                            xs={12}
                            sm={12}
                            md={4}
                        >
                            <Card raised={true}>
                                <CardHeader
                                    title={"Recent Referrals"}
                                    titleTypographyProps={{ align: 'center' }}
                                    subheaderTypographyProps={{
                                        align: 'center',
                                    }}
                                    sx={{
                                        backgroundColor: (theme) =>
                                            theme.palette.mode === 'light'
                                                ? theme.palette.grey[200]
                                                : theme.palette.grey[700],
                                    }}
                                />
                                <Referrals referrals={referrals} />

                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </ThemeProvider>}
        </>
    )
}
