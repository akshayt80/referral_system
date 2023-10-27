### Description
Referral system to allow authenticated users the ability to receive payouts for new account signups(who successfully registers for a paid plan) with their referral code. System is integerated with Stripe as well for mimicking Payouts and Plan subscriptions.

### Setup
1. Everything is in docker container. Make sure you have installed the Docker on your system.
2. Make sure all the necessary ports are free to use (3000, 5050, 5437)
3. Update config if necessary. Recommend Setting ip address of the system for backend host set in frontend/.env
4. Add `STRIPE_KEY` and `STRIPE_PUB_KEY` in `docker_compose.yml` to make the integration with Stripe work in backend as well as frontend.
4. `dokcer-compose up` should build the images and bring up the containers. Run from this directory level itself.
5. `ctrl-c` to stop the containers gracefully
6. `docker-compose down` will remove the containers.
7. If you want to access this service from another system then before starting the app change the `REACT_APP_BACKEND_URL` and `REACT_APP_FRONTEND_URL` to have you system ip in place of localhost

### Usage
1. Go to `http://localhost:3000` in browser. It should take you to landing page
2. Click on `Login` button on top right to either `Login` or `Signup`.
3. It will ask to subscribe to a `Subscription Plan`
4. If paid plan is selected then you will have to checkout or else it will take you to `Dashboard`.

### Frontend
ReactJs + Typescript + Material UI + Stripe
- Uses port 3000
- For most of the frontend work I've used Material UI Templates

### Backend
Node + Express + Typescript + Sequelize (ORM) + Stripe
- Uses port 5050
- When backend container starts at that time we seed the database with few rows related to Subscription Plan.

### Database
Postgres
- Uses port 5437
- Seeding part is in `backend/src/db/init.ts`

## Tables:-
- Users (id, firstName, lastName, email, password, referralCode)
- UserSubscription (id, userId, subscriptionId)
- SubscriptionPlans (id, name, price, referralBonus)
- SubscriptionFeatures (id, text, subscriptionId)
- Referrals (id, userId, referredUserId, amountEarned, paid)

## Api Endpoints:-
GET /api/v1/user
POST /api/v1/user
POST /api/v1/user/login
GET /api/v1/user/subscription
GET /api/v1/user/referrals

GET /api/v1/subscription
POST /api/v1/subscription

POST /api/v1/payments/create-payment-intent
POST /api/v1/payments/verify

## Authentication:-
- Using JWT tokens to be used as Bearer Tokens with expiry of 2 days.

## Features Supported:-
- Signup
- Login
- Subscription to different plans Paid/Free
- No referral bonus for Free plan subscription
- Dashboard to show amount earned from referrals
- Subscription Plans support different bonus amount respectively through database entry. (Bonus 1)

## Assumptions:-
- Charge the customer only once.
- Customer can be part of only one subscription plan.
- Three subscription plans

## Gotchas:-
- In current setup the data in db doesn't persist if you remove the db container.
- Backend startup script does seeding to db. So in case you want to stop and start the app again recommended approach would be to remove db container and bring up the app.
- If you make any code changes then you will have to remove the docker image and rebuild it.

## Fututre Improvements:-
- Bonus 2
- In current setup both frontend and backend use development servers
- Use stripe webhook to verify the payment at th ebackend
- Test coverage
- Stricter Linting
- Input validation
- Frontend State management.
- Database seeding part always run when starting backend.
