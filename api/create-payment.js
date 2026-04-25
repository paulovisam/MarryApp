import { getPaymentProvider } from './lib/payment-provider.js';
import { createAbacatePayment } from './lib/create-abacate-payment.js';
import { createAsaasPayment } from './lib/create-asaas-payment.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET,OPTIONS,PATCH,DELETE,POST,PUT'
    );
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const provider = getPaymentProvider();
        const result =
            provider === 'asaas'
                ? await createAsaasPayment(req.body, req)
                : await createAbacatePayment(req.body, req);

        res.status(200).json({
            orderId: result.orderId,
            paymentUrl: result.paymentUrl,
            provider: result.provider,
        });
    } catch (error) {
        console.error('create-payment:', error.message);
        const msg = error.message || 'Failed to create payment';
        const clientError =
            /obrigatório|mínimo|inválido|CPF|Celular|CNPJ/i.test(msg);
        res.status(clientError ? 400 : 500).json({
            error: clientError ? msg : 'Failed to create payment',
        });
    }
}
