import express, {RequestHandler, Request, Response} from 'express'
import cors from "cors"
import connectDB from './db/db'
import mongoose from 'mongoose';
import authRoutes from './routes/auth';
import protectedRoutes from "./routes/protected";
import dotenv from "dotenv";
dotenv.config()
const router = express.Router()

const app = express()
const port = 6969;
const frontEntPort = 3000

app.use(express.json())
app.use(cors({
    origin: `http://localhost:${frontEntPort}`,
    methods: ['POST', 'GET'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))
connectDB()

app.get('/test-db', async (_, res: Response) => {
    try {
        const connectionState = mongoose.connection.readyState; // No `await` needed
        if (connectionState === 1) {
            res.status(200).send('Database connection is healthy');
        } else {
            res.status(503).send('Database is not connected');
        }
    } catch (err) {
        console.error('Error while checking database connection:', err);
        res.status(500).send('An error occurred while checking the database connection');
    }
});


app.use('/auth', authRoutes);
app.use('/protected', protectedRoutes);
// Start Server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
