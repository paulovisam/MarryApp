import 'dotenv/config';
/* eslint-disable no-undef */
import express from 'express';
import cors from 'cors';
import createPaymentHandler from './api/create-payment.js';
import paymentConfigHandler from './api/payment-config.js';
import webhookAbacatepayHandler from './api/webhook-abacatepay.js';
import webhookAsaasHandler from './api/webhook-asaas.js';
import webhookInfinitepayHandler from './api/webhook-infinitepay.js';

const app = express();
const PORT = process.env.PORT || 3001; // Run API on 3001 to avoid conflict with Vite (3000)

app.use(cors());

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

// Webhooks: um endpoint por provedor (corpo bruto só onde necessário)
app.post(
    '/api/webhook/abacatepay',
    express.raw({ type: 'application/json' }),
    adaptHandler(webhookAbacatepayHandler)
);

app.use(express.json());

app.post(
    '/api/webhook/asaas',
    adaptHandler(webhookAsaasHandler)
);
app.post(
    '/api/webhook/infinitepay',
    adaptHandler(webhookInfinitepayHandler)
);

app.get('/api/payment-config', adaptHandler(paymentConfigHandler));
app.all('/api/create-payment', adaptHandler(createPaymentHandler));

// Determine if we are in production (serving static files) or dev (API only)
// For this setup, we will run this as a separate API server alongside Vite
console.log(`API Server running on http://localhost:${PORT}`);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
