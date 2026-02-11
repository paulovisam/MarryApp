import 'dotenv/config';
/* eslint-disable no-undef */
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Helper to handle ESM imports
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001; // Run API on 3001 to avoid conflict with Vite (3000)

app.use(cors());
app.use(express.json());

// Load API routes dynamically or manually
// Using manual import for simplicity and to match Vercel style handling
// Load API routes dynamically or manually
import createPaymentHandler from './api/create-payment.js';
import webhookHandler from './api/webhook.js';

// Wrapper to adapt Vercel/Next.js style handler (req, res) to Express
const adaptHandler = (handler) => async (req, res) => {
    try {
        await handler(req, res);
    } catch (err) {
        console.error('Handler Error:', err);
        if (!res.headersSent) {
            res.status(500).json({ error: err.message });
        }
    }
};

// Define API Routes
app.all('/api/create-payment', adaptHandler(createPaymentHandler));
app.all('/api/webhook', adaptHandler(webhookHandler));

// Determine if we are in production (serving static files) or dev (API only)
// For this setup, we will run this as a separate API server alongside Vite
console.log(`API Server running on http://localhost:${PORT}`);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
