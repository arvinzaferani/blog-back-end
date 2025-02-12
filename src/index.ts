import express, {RequestHandler, Request, Response} from 'express'
import cors from "cors"
import connectDB from './db/db'
import mongoose from 'mongoose';
import authRoutes from './routes/auth';
import protectedRoutes from "./routes/protected";
import fileRoutes from "./routes/file";
import dotenv from "dotenv";
import path from "path";

dotenv.config()
const router = express.Router()

const app = express()
const port = 6969;
const frontEndPort = 3000
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(express.json())
app.use(cors({
    origin: `http://localhost:${frontEndPort}`,
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
app.use('/file', fileRoutes);
// Start Server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
