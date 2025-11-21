import express from 'express';

import cookieParser from 'cookie-parser';
import authRouter from './routes/auth.route.js';
import chatRouter from './routes/chats.route.js';
import postRouter from './routes/post.route.js';
import cors from 'cors';



const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
    'https://askly-the-college-query-platform.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:5174'
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
}));

app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/chat', chatRouter);
app.use('/api/post', postRouter);


export default app;