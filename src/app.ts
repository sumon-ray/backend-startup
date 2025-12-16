import cors from 'cors'
import express, { Application, Request, Response } from 'express'
const app: Application = express()

import cookieParser from 'cookie-parser'
import globalErrorHandler from './app/middleware/globalErrorhandler'
import notFound from './app/middleware/notFound'
import router from './app/routes'

// CORS configuration for multiple origins
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001']

const corsOptions: cors.CorsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) {
    if (!origin) return callback(null, true)

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

// parsers
app.use(express.json())
app.use(cors(corsOptions))

app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.get('/', (req: Request, res: Response) => {
  res.send('hello World')
})

app.use('/api/v1', router)
app.use(notFound)
app.use(globalErrorHandler)

app.get('/', (req: Request, res: Response) => {
  res.send('hello World')
})

export default app
