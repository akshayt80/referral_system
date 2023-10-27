import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import routes from './src/routes';


const app = express();
const PORT = 5050;

export const get = () => {
    const app: Application = express()

    // Body parsing Middleware
    app.use(cors())
    app.options('*', cors) // include before other routes
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))



    app.get('/', async (req: Request, res: Response): Promise<Response> => {
        return res.status(200).send({ message: `Welcome to the Referral system API! \n Endpoints available at http://localhost:${PORT}/api/v1` })
    })

    app.use('/api/v1', routes)

    return app
}

export const start = () => {
    const app = get()
    try {
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`)
        })
    } catch (error: any) {
        console.log(`Error occurred: ${error.message}`)
    }
}

start()
