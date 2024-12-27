"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./db/db"));
const mongoose_1 = __importDefault(require("mongoose"));
const auth_1 = __importDefault(require("./routes/auth"));
const protected_1 = __importDefault(require("./routes/protected"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = express_1.default.Router();
const app = (0, express_1.default)();
const port = 6969;
const frontEntPort = 3000;
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: `http://localhost:${frontEntPort}`,
    methods: ['POST', 'GET'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
(0, db_1.default)();
app.get('/test-db', async (_, res) => {
    try {
        const connectionState = mongoose_1.default.connection.readyState; // No `await` needed
        if (connectionState === 1) {
            res.status(200).send('Database connection is healthy');
        }
        else {
            res.status(503).send('Database is not connected');
        }
    }
    catch (err) {
        console.error('Error while checking database connection:', err);
        res.status(500).send('An error occurred while checking the database connection');
    }
});
app.use('/auth', auth_1.default);
app.use('/protected', protected_1.default);
// Start Server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
