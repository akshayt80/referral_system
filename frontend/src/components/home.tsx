import { AppBar, Button, CircularProgress, CssBaseline, GlobalStyles, Toolbar, Typography } from "@mui/material"
import React, { createContext, useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { UserSubscription } from "../interfaces/subscription.interafces"
import { get, post } from "../services.ts/api.service"
import { getUserToken, removeUserToken } from "../services.ts/token.service"
import { Dashboard } from "./dasboard"
import Subscription from "./subscriptions"

function Loading() {
    return (<CircularProgress />)
}

export const SubscriptionContext = createContext({
    setSubscriptionId: (id: number) => { }
})

export const PaymentRedirect = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const paymentIntent = searchParams.get("payment_intent")?.toString()
    const paymentIntentClientSecret = searchParams.get("payment_intent_client_secret")?.toString()

    useEffect(() => {
        if (paymentIntent && paymentIntentClientSecret) {
            setLoading(true)
            post("/payments/verify", { paymentIntent: paymentIntent, paymentIntentClientSecret: paymentIntentClientSecret }, true)
                .then(_ => setLoading(false))
                .then(_ => navigate("/home"))
        } else {
            navigate("/home")
        }
    }, [paymentIntent, paymentIntentClientSecret])

    return (
        <>
            {loading ? <Loading /> : null}
        </>
    )
}

export default function Home() {
    const [loading, setLoading] = useState(true)
    const [subscriptionId, setSubscriptionId] = useState<number>()

    useEffect(() => {
        setLoading(true)
        const userToken = getUserToken()
        get("/user/subscription", true)
            .then((data: UserSubscription) => {
                data.subscriptionId !== null ? setSubscriptionId(data.subscriptionId) : null
            }).finally(() => setLoading(false))
    }, [])



    const handleLogout = () => {
        removeUserToken()
    }
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
                        Referral System
                    </Typography>
                    <Button href="/" variant="outlined" sx={{ my: 1, mx: 1.5 }} onClick={handleLogout}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
            <SubscriptionContext.Provider value={{ setSubscriptionId }}>
                {loading ? <Loading /> : subscriptionId ? <Dashboard /> : <Subscription />}
            </SubscriptionContext.Provider>
        </>
    )
}

