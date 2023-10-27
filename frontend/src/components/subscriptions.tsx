import React, { useContext, useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { SubscriptionPlan, SubscriptionPlanResponse } from '../interfaces/subscription.interafces';
import { get, post } from '../services.ts/api.service';
import { Alert, CircularProgress } from '@mui/material';
import { getUserToken } from '../services.ts/token.service';
import { SubscriptionContext } from './home';
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { PaymentElement } from '@stripe/react-stripe-js';
import { frontendHost } from '../services.ts/config.service';

const stripPromise = loadStripe(process.env.STRIPE_PUB_KEY)

type CheckoutProps = {
    amount: number
}

type PaymentIntentResponse = {
    clientSecret: string;
}

type SubscriptionPlansProps = {
    subscriptionPlans: SubscriptionPlan[],
    userId: number,
}

function Checkout({ amount }: CheckoutProps) {
    const stripe = useStripe()
    const elements = useElements()
    const [error, setError] = useState<string>()
    const [loading, setLoading] = useState<boolean>(false)

    const handleSubmit = async () => {
        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return
        }
        setLoading(true)

        const { error } = await stripe.confirmPayment({ elements, confirmParams: { return_url: `${frontendHost()}/payment` } })
        if (error.type === "card_error" || error.type === "validation_error") {
            console.log(error.message)
            setError(error.message)
        } else {
            const msg = `unexpected error occurred: ${error.type} - ${error.message}`
            console.log(msg)
            setError(msg)
        }
        setLoading(false)
    }
    return (
        <>
            <Card raised={true}>
                <CardHeader
                    title="Amount to be paid"
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
                <CardContent>
                    <Typography component="h2" variant="h3" color="text.primary">
                        ${amount}
                    </Typography>
                </CardContent>
            </Card>
            <Card raised={true}>
                <PaymentElement />
                {error && <Alert severity='error'>{error}</Alert>}
                {loading || (!stripe && !elements) ? <CircularProgress /> : null}
                <Button
                    fullWidth
                    variant="contained"
                    onClick={() => handleSubmit()}
                >
                    Submit
                </Button>
            </Card>
        </>

    )
}




function SubscriptionPlans({ subscriptionPlans, userId }: SubscriptionPlansProps) {

    const subscriptionContext = useContext(SubscriptionContext)
    const [clientSecret, setClientSecret] = useState<string>()
    const [subscriptionId, setSubscriptionId] = useState<number>()
    const [amount, setAmount] = useState<number>(0)
    const [loading, setLoading] = useState(false)

    const handleClick = (subscriptionPlan: SubscriptionPlan) => {
        setLoading(true)
        setSubscriptionId(subscriptionPlan.subscriptionId)
        if (subscriptionPlan.price === 0) {
            post("/subscription", { userId: userId, price: subscriptionPlan.price, subscriptionId: subscriptionPlan.subscriptionId }, true)
                .then(_ => {
                    subscriptionContext.setSubscriptionId(subscriptionPlan.subscriptionId)
                    setLoading(false)
                })
        } else {
            setAmount(subscriptionPlan.price)
            post('/payments/create-payment-intent', { userId: userId, subscriptionId: subscriptionPlan.subscriptionId }, true)
                .then((data: PaymentIntentResponse) => {
                    setClientSecret(data.clientSecret)
                    setLoading(false)
                })
        }

    }
    return (<>

        {/* Hero unit */}
        <Container disableGutters maxWidth="sm" component="main" sx={{ pt: 8, pb: 6 }}>
            <Typography
                component="h1"
                variant="h2"
                align="center"
                color="text.primary"
                gutterBottom
            >
                Subscription Plans
            </Typography>
            <Typography variant="h5" align="center" color="text.secondary" component="p">
                Pick the most suitable subscription as per your needs.
            </Typography>
        </Container>
        {/* End hero unit */}
        <Container maxWidth="md" component="main">
            <Grid container spacing={5} alignItems="flex-end">
                {!clientSecret && !subscriptionId && subscriptionPlans.map((subscriptionPlan) => (
                    // Enterprise card is full width at sm breakpoint
                    <Grid
                        item
                        key={subscriptionPlan.name}
                        xs={12}
                        sm={subscriptionPlan.name === 'Enterprise' ? 12 : 6}
                        md={4}
                    >
                        <Card>
                            <CardHeader
                                title={subscriptionPlan.name}
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
                            <CardContent>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'baseline',
                                        mb: 2,
                                    }}
                                >
                                    <Typography component="h2" variant="h3" color="text.primary">
                                        ${subscriptionPlan.price}
                                    </Typography>
                                </Box>
                                <ul>
                                    {subscriptionPlan.features.map((line) => (
                                        <Typography
                                            component="li"
                                            variant="subtitle1"
                                            align="center"
                                            key={line}
                                        >
                                            {line}
                                        </Typography>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardActions>
                                <Button
                                    fullWidth
                                    variant={subscriptionPlan.price === 0 ? "outlined" : "contained"}
                                    onClick={() => handleClick(subscriptionPlan)}
                                >
                                    {subscriptionPlan.price === 0 ? "Select" : "Buy"}
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
                {loading && <CircularProgress />}
                {clientSecret && subscriptionId && (
                    <Grid
                        item
                        key={"payment"}
                        xs={12}
                        sm={12}
                        md={4}
                        alignSelf="center"
                        justifySelf={"center"}
                        alignItems="center"
                    >
                        <Elements options={{ clientSecret, appearance: { theme: "stripe" } }} stripe={stripPromise}>
                            <Checkout amount={amount} />
                        </Elements>
                    </Grid>
                )
                }
            </Grid>
        </Container>
    </>)
}

export default function Subscription() {

    const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
    const [loading, setLoading] = useState(true)
    const userToken = getUserToken()
    useEffect(() => {
        get("/subscription")
            .then((data: SubscriptionPlanResponse) => setSubscriptionPlans(data.subscriptionPlans))
            .then(_ => setLoading(false))
    }, [])
    return (
        <>
            {loading && subscriptionPlans.length > 0 ? <CircularProgress /> : <SubscriptionPlans subscriptionPlans={subscriptionPlans} userId={userToken!!.userId} />}
        </>
    );
}

